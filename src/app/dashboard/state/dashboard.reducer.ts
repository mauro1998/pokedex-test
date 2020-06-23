import { Action, createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';
import { Pokemon } from 'src/app/core/models';

export const dashboardFeatureKey = 'dashboard';

export interface State {
	count: number;
	pokemons: Pokemon[];
	request: {
		id: string;
		loading: boolean;
		error: any;
	};
}

export const initialState: State = {
	count: 0,
	pokemons: [],
	request: {
		id: null,
		loading: false,
		error: null,
	},
};

export const reducer = createReducer(
	initialState,

	// Load Pokemons
	on(
		DashboardActions.loadPokemons,
		(state, action): State => {
			return {
				...state,
				request: {
					id: action.requestId,
					loading: true,
					error: null,
				},
			};
		}
	),
	on(
		DashboardActions.loadPokemonsSuccess,
		(state, action): State => {
			const cached = state.pokemons;
			const additions = action.pokemons.filter(({ id }) => {
				return !cached.some((pokemon) => pokemon.id === id);
			});

			const pokemons = [...cached, ...additions];

			return {
				...state,
				pokemons,
				count: pokemons.length,
				request: {
					id: action.requestId,
					loading: false,
					error: null,
				},
			};
		}
	),
	on(
		DashboardActions.loadPokemonsFailure,
		(state, action): State => {
			return {
				...state,
				request: {
					id: action.requestId,
					loading: false,
					error: action.error,
				},
			};
		}
	)
);
