import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/core/models';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'auth';

export interface State {
	session: {
		user: User;
		loading: boolean;
		error: Error;
	};
	signup: {
		loading: boolean;
		error: Error;
	};
}

export const initialState: State = {
	session: {
		user: null,
		loading: false,
		error: null,
	},
	signup: {
		loading: false,
		error: null,
	},
};

export const reducer = createReducer(
	initialState,

	// Sign In Actions
	on(AuthActions.signIn, (state) => {
		return {
			...state,
			session: {
				...initialState.session,
				loading: true,
			},
		};
	}),
	on(AuthActions.signInSuccess, (state, action) => {
		return {
			...state,
			session: {
				loading: false,
				user: action.user,
				error: null,
			},
		};
	}),
	on(AuthActions.signInFailure, (state, action) => {
		return {
			...state,
			session: {
				loading: false,
				user: null,
				error: action.error,
			},
		};
	}),

	// Sign Up Actions
	on(AuthActions.signUp, (state) => {
		return {
			...state,
			signup: {
				error: null,
				loading: true,
			},
		};
	}),
	on(AuthActions.signUpFailure, (state, action) => {
		return {
			...state,
			signup: {
				error: action.error,
				loading: false,
			},
		};
	})
);
