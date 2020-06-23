import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthEffects } from './state/auth.effects';
import { StoreModule } from '@ngrx/store';
import { authFeatureKey, reducer } from './state/auth.reducer';

@NgModule({
	declarations: [AuthComponent, SignInComponent, SignUpComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AuthRoutingModule,
		EffectsModule.forFeature([AuthEffects]),
		StoreModule.forFeature(authFeatureKey, reducer),
	],
})
export class AuthModule {}
