import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, delay, map } from 'rxjs/operators';
import { PokeapiService } from 'src/app/core/pokeapi.service';
import * as DashboardActions from './dashboard.actions';

@Injectable()
export class DashboardEffects {
	// NOTE: even though this is not a smart strategy to follow given that
	// this application is intended for mobile devices i'm doing it to
	// fulfill requirements; recursively fetch pokeapi data by portions:
	startLazyFetch$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(DashboardActions.startLazyFetch),
			concatMap(() => this.lazyFetch())
		);
	});

	continueLazyFetch$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(DashboardActions.lazyFetchSuccess),
			// give brief pause of 5 seconds to continue fetching data
			concatMap(() => this.lazyFetch(5000))
		);
	});

	constructor(private actions$: Actions, private pokeapi: PokeapiService) {}

	private lazyFetch(time: number = 0): Observable<Action> {
		return this.pokeapi.retrieveFromInternalStorage().pipe(
			concatMap((storedData) => {
				if (
					!storedData ||
					storedData.results.length < storedData.count
				) {
					return this.pokeapi.fetchNext(storedData).pipe(
						delay(time),
						map((data) =>
							DashboardActions.lazyFetchSuccess({ data })
						)
					);
				}

				return of(
					DashboardActions.lazyFetchFinished({ data: storedData })
				);
			})
		);
	}
}
