import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import {
	catchError,
	concatMap,
	map,
	tap,
	switchMap,
	filter,
} from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';
import * as AuthActions from './auth.actions';
import { User } from 'src/app/core/models';

@Injectable()
export class AuthEffects {
	signIn$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AuthActions.signIn),
			concatMap((action) =>
				this._auth
					.signInWithEmailAndPassword(action.email, action.password)
					.pipe(
						map((user) => AuthActions.signInSuccess({ user })),
						catchError((error) =>
							of(AuthActions.signInFailure({ error }))
						)
					)
			)
		);
	});

	signUp$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AuthActions.signUp),
			concatMap((action) =>
				this._auth
					.signUpWithEmailAndPassword(
						action.firstName,
						action.lastName,
						action.email,
						action.password
					)
					.pipe(
						map((user) => AuthActions.signInSuccess({ user })),
						catchError((error) =>
							of(AuthActions.signUpFailure({ error }))
						)
					)
			)
		);
	});

	signInSuccess$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(AuthActions.signInSuccess),
				tap((action) => {
					console.log(action);
				})
			);
		},
		{ dispatch: false }
	);

	checkAuthState$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AuthActions.checkAuthState),
			switchMap(() => this._auth.getSession()),
			filter((user: User) => !!user),
			map((user: User) => AuthActions.signInSuccess({ user }))
		);
	});

	constructor(private actions$: Actions, private _auth: AuthService) {}
}
