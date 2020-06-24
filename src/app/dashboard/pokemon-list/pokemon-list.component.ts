import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { Pokemon } from 'src/app/core/models';
import { getUniqueId } from 'src/app/core/util';
import { getNextPage, searchItemsInView } from '../state/dashboard.actions';
import {
	selectCurrentItemsInDashboard,
	selectCurrentRequestState,
} from '../state/dashboard.selectors';

@Component({
	selector: 'app-pokemon-list',
	templateUrl: './pokemon-list.component.html',
	styleUrls: ['./pokemon-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent implements OnInit {
	limit = 10;
	lastReqId: string;
	firstReqId: string;
	skeletons = [1, 2, 3, 4, 5, 6];

	itemsInView$: Observable<Pokemon[]>;
	loadingItemsInView$: Observable<boolean>;

	infiniteScroll: IonInfiniteScroll;

	constructor(private store: Store, private router: NavController) {}

	ngOnInit(): void {
		this.loadingItemsInView$ = this.store.pipe(
			select(selectCurrentRequestState),
			tap((request) => {
				if (this.infiniteScroll && !request.pending) {
					this.infiniteScroll.complete();
				}
			}),
			filter((request) => request.id === this.firstReqId),
			map((request) => request.pending),
			shareReplay(1)
		);

		this.itemsInView$ = this.store.pipe(
			select(selectCurrentItemsInDashboard),
			tap((state) => {
				if (this.infiniteScroll) {
					this.infiniteScroll.disabled = state.finished;
				}
			}),
			map((state) => state.items)
		);

		this.loadData();
	}

	loadData(event = null) {
		if (event) {
			this.infiniteScroll = event.target;
		}

		this.lastReqId = getUniqueId();

		if (!this.firstReqId) this.firstReqId = this.lastReqId;

		this.store.dispatch(
			getNextPage({
				limit: this.limit,
				requestId: this.lastReqId,
			})
		);
	}

	showDetail(id: string) {
		this.router.navigateForward(`/dashboard/detail/${id}`);
	}

	onSearch(value: string) {
		const val = value.trim();

		this.store.dispatch(
			searchItemsInView({
				value: val,
			})
		);
	}
}
