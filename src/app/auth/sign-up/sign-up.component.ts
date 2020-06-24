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
import { selectSignupState } from '../state/auth.selectors';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit, OnDestroy {
	signUpForm: FormGroup;
	error$: Observable<Error>;
	destroy$ = new Subject();

	constructor(
		private store: Store,
		private toast: ToastController,
		private router: NavController
	) {}

	ngOnInit(): void {
		this.signUpForm = new FormGroup({
			firstName: new FormControl('', [Validators.required]),
			lastName: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(6),
			]),
			confirmPassword: new FormControl('', [Validators.required]),
		});

		this.error$ = this.store.pipe(
			select(selectSignupState),
			filter((session) => !!session.error),
			map((session) => session.error),
			takeUntil(this.destroy$)
		);

		this.error$.subscribe(async (error) => {
			const toast = await this.toast.create({
				animated: true,
				duration: 5000,
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
		this.signUpForm.markAllAsTouched();

		if (this.signUpForm.valid && this.passwordMatches) {
			this.store.dispatch(
				authActions.signUp({
					firstName: this.signUpForm.value.firstName,
					lastName: this.signUpForm.value.lastName,
					email: this.signUpForm.value.email,
					password: this.signUpForm.value.password,
				})
			);
		}
	}

	get firstName() {
		return this.signUpForm.get('firstName');
	}

	get lastName() {
		return this.signUpForm.get('lastName');
	}

	get email() {
		return this.signUpForm.get('email');
	}

	get password() {
		return this.signUpForm.get('password');
	}

	get confirmPassword() {
		return this.signUpForm.get('confirmPassword');
	}

	get passwordMatches() {
		return (
			this.password.valid &&
			this.confirmPassword.valid &&
			this.password.value === this.confirmPassword.value
		);
	}

	goToSignIn() {
		this.router.navigateRoot('/sign-in');
	}
}
