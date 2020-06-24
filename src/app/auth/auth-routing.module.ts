import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthGuard } from './auth.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'sign-in',
	},
	{
		path: 'sign-in',
		component: SignInComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'sign-up',
		component: SignUpComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
