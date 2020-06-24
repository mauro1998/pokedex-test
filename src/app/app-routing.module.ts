import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./auth/auth.module').then((m) => m.AuthModule),
	},
	{
		path: 'dashboard',
		loadChildren: () =>
			import('./dashboard/dashboard.module').then(
				(m) => m.DashboardModule
			),
	},
	{
		path: '**',
		pathMatch: 'full',
		redirectTo: '/dashboard',
	},
];
@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			preloadingStrategy: PreloadAllModules,
			paramsInheritanceStrategy: 'always',
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
