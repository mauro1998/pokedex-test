import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
	PokeapiData,
	Pokemon,
	PokemonListResponse,
	PokemonResponse,
} from './models';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root',
})
export class PokeapiService {
	private readonly storageKey = 'pokeapi_data';
	private readonly pokeapi = 'https://pokeapi.co/api/v2/pokemon';
	private offset = 0;
	private limit = 50;

	constructor(private http: HttpClient, private storage: StorageService) {}

	public fetchPokeapiData(
		offset: number = 0,
		limit: number = 50
	): Observable<PokeapiData> {
		const params = new HttpParams()
			.set('offset', `${offset}`)
			.set('limit', `${limit}`);

		return this.http.get(this.pokeapi, { params }).pipe(
			switchMap((response: PokemonListResponse) => {
				return forkJoin(
					// make a request per entity to get detailed information as per requirements
					response.results.map((data) =>
						this.http.get<PokemonResponse>(data.url)
					)
				).pipe(
					// map entities and only extract required data
					map((responses: PokemonResponse[]) => {
						return {
							count: response.count,
							results: responses.map((data) => {
								return new Pokemon(
									data.id,
									data.name,
									data.sprites.front_default,
									data.types.map(
										(typeData) => typeData.type.name
									),
									data.height,
									data.weight,
									data.moves.map(
										(moveData) => moveData.move.name
									)
								);
							}),
						};
					})
				);
			})
		);
	}

	public fetchNext(storedData: PokeapiData): Observable<PokeapiData> {
		return this.fetchPokeapiData(this.offset, this.limit).pipe(
			map((data) => this.saveUsingInternalStorage(data, storedData))
		);
	}

	public retrieveFromInternalStorage(): Observable<PokeapiData> {
		return this.storage.get<PokeapiData>(this.storageKey).pipe(
			map((data) => {
				if (!data) return null;

				return {
					count: data.count,
					results: data.results.map(
						(res) =>
							new Pokemon(
								res.id,
								res.name,
								res.picurl,
								res.types,
								res.height,
								res.weight,
								res.movements
							)
					),
				};
			})
		);
	}

	private saveUsingInternalStorage(
		newData: PokeapiData,
		storedData: PokeapiData
	): PokeapiData {
		// guard against possible duplicates and only save new data:
		const additionals = storedData
			? newData.results.filter((pokemon) => {
					return !storedData.results.some(
						({ id }) => id === pokemon.id
					);
			  })
			: newData.results;

		// store data sorted by id asc
		const stored = storedData?.results || [];
		const results = [...stored, ...additionals].sort((a, b) => a.id - b.id);

		const result = {
			count: storedData?.count || newData.count,
			results,
		};

		// save data
		this.storage.set<PokeapiData>(this.storageKey, result);

		// update offset to fetch remaining data
		this.offset = results.length;

		return result;
	}
}
