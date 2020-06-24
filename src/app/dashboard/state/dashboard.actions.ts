import { createAction, props } from '@ngrx/store';
import { Pokemon, PokeapiData } from 'src/app/core/models';

export const startLazyFetch = createAction(
	'[Dashboard] Start Pokeapi Lazy Fetch'
);

export const lazyFetchSuccess = createAction(
	'[Dashboard] Pokeapi Lazy Fetch Success',
	props<{ data: PokeapiData }>()
);

export const lazyFetchFinished = createAction(
	'[Dashboard] Pokeapi Lazy Fetch Finished',
	props<{ data: PokeapiData }>()
);

export const getNextPage = createAction(
	'[Dashboard] Load Pokemons',
	props<{ requestId: string; limit: number }>()
);

export const searchItemsInView = createAction(
	'[Dashboard] Search Pokemons',
	props<{ value: string }>()
);

export const setSelectedItem = createAction(
	'[Dashboard] Set Selected Item',
	props<{ id: string }>()
);
