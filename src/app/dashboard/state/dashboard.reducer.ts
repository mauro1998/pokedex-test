import { createReducer, on } from '@ngrx/store';
import { Pokemon } from 'src/app/core/models';
import * as DashboardActions from './dashboard.actions';

export const dashboardFeatureKey = 'dashboard';

export interface State {
	// control what's currently fetched from the api:
	count: number;
	pokemons: Pokemon[];
	fetching: boolean;

	// control what's currently displayed in dashboard:
	dashboard: {
		data: Pokemon[];
		initialData: Pokemon[];
		finished: boolean;

		// infinite scroll request state:
		request: {
			id: string;
			limit: number;
			offset: number;
			pending: boolean;
		};

		// search state control:
		search: {
			value: string;
			results: Pokemon[];
		};
	};

	// track currently selected pokemon
	selected: Pokemon;
}

export const initialState: State = {
	count: 0,
	pokemons: [],
	fetching: true,

	dashboard: {
		data: [],
		initialData: null,
		finished: false,
		request: {
			id: null,
			limit: 50,
			offset: 0,
			pending: false,
		},
		search: {
			value: null,
			results: [],
		},
	},

	selected: null,
};

const processActiveRequests = (state: State, action: any): State => {
	const { requestId, limit } = action;

	if (!requestId) return state;

	const offset = state.dashboard.request.offset;
	const nextTotal = offset + limit;
	const pending = nextTotal > state.pokemons.length && state.fetching;

	// if data is still being fetched return current state,
	// otherwise return next piece of data
	const data = pending
		? state.dashboard.data
		: [...state.dashboard.data, ...state.pokemons.slice(offset, nextTotal)];

	const finished = data.length === state.pokemons.length && !state.fetching;

	return {
		...state,
		dashboard: {
			...state.dashboard,
			data,
			initialData: state.dashboard.initialData
				? state.dashboard.initialData
				: [...data],
			finished,
			request: {
				id: requestId,
				limit,
				pending,
				offset: pending ? offset : nextTotal,
			},
		},
	};
};

export const reducer = createReducer(
	initialState,

	// lazy fetch operations
	on(
		DashboardActions.lazyFetchSuccess,
		(state, action): State => {
			const newState = {
				...state,
				count: action.data.count,
				pokemons: action.data.results,
				fetching: true,
			};

			return processActiveRequests(newState, {
				requestId: newState.dashboard.request.id,
				limit: newState.dashboard.request.limit,
			});
		}
	),

	on(
		DashboardActions.lazyFetchFinished,
		(state, action): State => {
			const newState = {
				...state,
				count: action.data.count,
				pokemons: action.data.results,
				fetching: false,
			};

			return processActiveRequests(newState, {
				requestId: newState.dashboard.request.id,
				limit: newState.dashboard.request.limit,
			});
		}
	),

	// show next portion of data if available
	on(
		DashboardActions.getNextPage,
		(state, action): State => processActiveRequests(state, action)
	),

	// search items in view
	on(
		DashboardActions.searchItemsInView,
		(state, action): State => {
			if (!action.value) {
				return {
					...state,
					dashboard: {
						...state.dashboard,
						search: {
							value: null,
							results: [],
						},
					},
				};
			}

			const results = [];
			const regexp = new RegExp(action.value, 'ig');

			for (const pokemon of state.pokemons) {
				if (
					regexp.test(pokemon.name) ||
					regexp.test(pokemon.types.join(', '))
				) {
					results.push(pokemon);
				}
			}

			return {
				...state,
				dashboard: {
					...state.dashboard,
					data: [...state.dashboard.initialData],
					finished: false,
					request: {
						id: null,
						offset: 0,
						pending: false,
						limit: state.dashboard.request.limit,
					},
					search: {
						value: action.value,
						results,
					},
				},
			};
		}
	),

	// set selected item
	on(
		DashboardActions.setSelectedItem,
		(state, action): State => {
			return {
				...state,
				selected: state.pokemons.find(
					(pokemon) => pokemon.id === +action.id
				),
				dashboard: {
					...state.dashboard,
					data: [...state.dashboard.initialData],
					finished: false,
					request: {
						id: null,
						offset: 0,
						pending: false,
						limit: state.dashboard.request.limit,
					},
					search: {
						value: null,
						results: [],
					},
				},
			};
		}
	)
);
