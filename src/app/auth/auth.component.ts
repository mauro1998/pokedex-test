import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectAuthState } from './state/auth.selectors';
import { map } from 'rxjs/operators';
import { checkAuthState } from './state/auth.actions';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
	loading$: Observable<boolean>;

	constructor(private store: Store) {}

	ngOnInit(): void {
		this.loading$ = this.store.pipe(
			select(selectAuthState),
			map((state) => state.session.loading || state.signup.loading)
		);
	}
}
