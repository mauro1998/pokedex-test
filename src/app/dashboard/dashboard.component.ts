import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { checkAuthState, logOut } from '../auth/state/auth.actions';
import { selectSession } from '../auth/state/auth.selectors';
import { User } from '../core/models';
import { State } from '../reducers';
import { startLazyFetch } from './state/dashboard.actions';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	session$: Observable<User>;

	constructor(
		private store: Store<State>,
		private alertController: AlertController
	) {}

	ngOnInit(): void {
		this.store.dispatch(checkAuthState());
		this.store.dispatch(startLazyFetch());
		this.session$ = this.store.pipe(
			select(selectSession),
			map((session) => session.user)
		);
	}

	async logOut() {
		const alert = await this.alertController.create({
			header: 'Confirm log out',
			message: 'Are you sure you want to leave?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
				},
				{
					text: 'Yes',
					handler: () => this.store.dispatch(logOut()),
				},
			],
		});

		await alert.present();
	}
}
