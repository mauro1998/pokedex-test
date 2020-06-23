import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/core/models';

// Sign in actions
export const signIn = createAction(
	'[Auth] Started Sign In Request',
	props<{ email: string; password: string }>()
);

export const signInSuccess = createAction(
	'[Auth] Sign In Success',
	props<{ user: User }>()
);

export const signInFailure = createAction(
	'[Auth] Sign In Failure',
	props<{ error: Error }>()
);

// Sign up actions
export const signUp = createAction(
	'[Auth] Started Sign Up Request',
	props<{
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	}>()
);

export const signUpFailure = createAction(
	'[Auth] Sign Up Failure',
	props<{ error: Error }>()
);

// Check auth state actions
export const checkAuthState = createAction('[Auth] Check Auth State');
