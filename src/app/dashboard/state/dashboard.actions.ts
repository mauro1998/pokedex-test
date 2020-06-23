import { createAction, props } from '@ngrx/store';
import { Pokemon } from 'src/app/core/models';

export const loadPokemons = createAction(
	'[Dashboard] Load Pokemons',
	props<{ requestId: string; offset: number; limit: number }>()
);

export const loadPokemonsSuccess = createAction(
	'[Dashboard] Load Pokemons Success',
	props<{ requestId: string; pokemons: Pokemon[] }>()
);

export const loadPokemonsFailure = createAction(
	'[Dashboard] Load Pokemons Failure',
	props<{ requestId: string; error: any }>()
);
