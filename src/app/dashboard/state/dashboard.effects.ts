import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { PokeapiService } from 'src/app/core/pokeapi.service';
import * as DashboardActions from './dashboard.actions';

@Injectable()
export class DashboardEffects {
	loadPokemons$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(DashboardActions.loadPokemons),
			concatMap((action) => {
				const { offset = 0, limit = 50, requestId } = action;
				return this._pokeapi.getPokemons(offset, limit).pipe(
					map((pokemons) =>
						DashboardActions.loadPokemonsSuccess({
							requestId,
							pokemons,
						})
					),
					catchError((error) =>
						of(
							DashboardActions.loadPokemonsFailure({
								requestId,
								error,
							})
						)
					)
				);
			})
		);
	});

	constructor(private actions$: Actions, private _pokeapi: PokeapiService) {}
}
