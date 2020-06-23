import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.State>(
	fromAuth.authFeatureKey
);

export const selectSession = createSelector(
	selectAuthState,
	(state) => state.session
);

export const selectSignupState = createSelector(
	selectAuthState,
	(state) => state.signup
);
