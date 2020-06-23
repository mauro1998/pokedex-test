import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PokemonListResponse, PokemonResponse, Pokemon } from './models';

@Injectable({
	providedIn: 'root',
})
export class PokeapiService {
	private readonly pokeapi = 'https://pokeapi.co/api/v2/pokemon';

	constructor(private _http: HttpClient) {}

	public getPokemons(
		offset: number = 0,
		limit: number = 50
	): Observable<Pokemon[]> {
		const params = new HttpParams()
			.set('offset', `${offset}`)
			.set('limit', `${limit}`);

		return this._http.get(this.pokeapi, { params }).pipe(
			switchMap((response: PokemonListResponse) => {
				return forkJoin(
					response.results.map((data) =>
						this._http.get<PokemonResponse>(data.url)
					)
				);
			}),
			map((responses: PokemonResponse[]) => {
				return responses.map((data) => {
					return new Pokemon(
						data.id,
						data.name,
						data.sprites.front_default,
						data.types.map((typeData) => typeData.type.name),
						data.height,
						data.weight,
						data.moves.map((moveData) => moveData.move.name)
					);
				});
			})
		);
	}
}
