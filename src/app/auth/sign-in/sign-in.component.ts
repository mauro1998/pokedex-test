import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import * as authActions from '../state/auth.actions';
import { selectSession } from '../state/auth.selectors';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit, OnDestroy {
	signInForm: FormGroup;
	error$: Observable<Error>;
	destroy$ = new Subject();

	constructor(
		private store: Store,
		private toast: ToastController,
		private router: NavController
	) {}

	ngOnInit(): void {
		this.signInForm = new FormGroup({
			email: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});

		this.error$ = this.store.pipe(
			select(selectSession),
			filter((session) => !!session.error),
			map((session) => session.error),
			takeUntil(this.destroy$)
		);

		this.error$.subscribe(async (error) => {
			const toast = await this.toast.create({
				animated: true,
				duration: 3000,
				message: error.message,
				position: 'bottom',
			});

			await toast.present();
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmit(): void {
		this.signInForm.markAllAsTouched();

		if (this.signInForm.valid) {
			this.store.dispatch(
				authActions.signIn({
					email: this.signInForm.value.email,
					password: this.signInForm.value.password,
				})
			);

			this.signInForm.reset();
		}
	}

	get email() {
		return this.signInForm.get('email');
	}

	get password() {
		return this.signInForm.get('password');
	}

	goToSignUp() {
		this.router.navigateRoot('/sign-up');
	}
}
