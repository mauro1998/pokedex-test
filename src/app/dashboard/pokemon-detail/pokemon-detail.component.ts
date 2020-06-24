import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { Pokemon } from 'src/app/core/models';
import { setSelectedItem } from '../state/dashboard.actions';
import { getSelectedItem } from '../state/dashboard.selectors';

@Component({
	selector: 'app-pokemon-detail',
	templateUrl: './pokemon-detail.component.html',
	styleUrls: ['./pokemon-detail.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailComponent implements OnInit {
	pokemon$: Observable<Pokemon>;

	constructor(private store: Store, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.pokemon$ = this.route.params.pipe(
			concatMap((params) => {
				this.store.dispatch(setSelectedItem({ id: params.id }));
				return this.store.pipe(delay(700), select(getSelectedItem));
			})
		);
	}
}
