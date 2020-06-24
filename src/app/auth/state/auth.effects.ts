import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
	catchError,
	concatMap,
	filter,
	map,
	switchMap,
	tap,
} from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/core/models';
import * as AuthActions from './auth.actions';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable()
export class AuthEffects {
	signIn$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AuthActions.signIn),
			concatMap((action) =>
				this.auth
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
				this.auth
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
				tap(() => {
					// tslint:disable-next-line: no-string-literal
					const url = this.route.snapshot['_routerState'].url;
					if (!/dashboard/g.test(url)) {
						this.router.navigateForward('/dashboard');
					}
				})
			);
		},
		{ dispatch: false }
	);

	checkAuthState$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AuthActions.checkAuthState),
			switchMap(() => this.auth.getSession()),
			filter((user: User) => !!user),
			map((user: User) => AuthActions.signInSuccess({ user }))
		);
	});

	logOut$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AuthActions.logOut),
			map(() => {
				this.auth.logOut();
				return AuthActions.logOutSuccess();
			})
		);
	});

	logOutSuccess$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(AuthActions.logOutSuccess),
				tap(() => this.router.navigateBack('/'))
			);
		},
		{ dispatch: false }
	);

	constructor(
		private actions$: Actions,
		private auth: AuthService,
		private router: NavController,
		private route: ActivatedRoute
	) {}
}
