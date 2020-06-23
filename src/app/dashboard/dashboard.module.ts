import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardEffects } from './state/dashboard.effects';
import { dashboardFeatureKey, reducer } from './state/dashboard.reducer';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';

@NgModule({
	declarations: [DashboardComponent, PokemonListComponent, PokemonDetailComponent],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		EffectsModule.forFeature([DashboardEffects]),
		StoreModule.forFeature(dashboardFeatureKey, reducer),
	],
})
export class DashboardModule {}
