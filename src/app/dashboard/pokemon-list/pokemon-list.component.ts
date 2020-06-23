import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { Pokemon } from 'src/app/core/models';
import { getUniqueId } from 'src/app/core/util';
import { loadPokemons } from '../state/dashboard.actions';
import { selectDashboardState } from '../state/dashboard.selectors';

@Component({
	selector: 'app-pokemon-list',
	templateUrl: './pokemon-list.component.html',
	styleUrls: ['./pokemon-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent implements OnInit {
	offset = 0;
	limit = 10;
	lastReqId: string;
	firstReqId: string;
	skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	pokemons$: Observable<Pokemon[]>;
	loading$: Observable<boolean>;

	infiniteScroll: IonInfiniteScroll;

	constructor(private store: Store) {}

	ngOnInit(): void {
		const data$ = this.store.pipe(
			select(selectDashboardState),
			shareReplay(1)
		);

		this.pokemons$ = data$.pipe(map((state) => state.pokemons));
		this.loading$ = data$.pipe(
			filter((state) => state.request.id === this.firstReqId),
			map((state) => state.request.loading),
			shareReplay(1)
		);

		data$.subscribe((data) => {
			if (!data.request.loading && this.infiniteScroll) {
				console.log('completed!');
				this.infiniteScroll.complete();
			}

			this.offset = data.count;
		});

		this.loadData();
	}

	loadData(event = null) {
		this.lastReqId = getUniqueId();

		if (!this.firstReqId) this.firstReqId = this.lastReqId;

		this.store.dispatch(
			loadPokemons({
				limit: this.limit,
				offset: this.offset,
				requestId: this.lastReqId,
			})
		);

		if (event) {
			this.infiniteScroll = event.target;
		}
		// App logic to determine if all data is loaded
		// and disable the infinite scroll
		// if (data.length == 1000) {
		// event.target.disabled = true;
		// }
	}
}
