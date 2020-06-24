import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromDashboard from './dashboard.reducer';
import { Pokemon } from 'src/app/core/models';

export const selectDashboardState = createFeatureSelector<fromDashboard.State>(
	fromDashboard.dashboardFeatureKey
);

export const selectCurrentItemsInDashboard = createSelector(
	selectDashboardState,
	(state: fromDashboard.State) => {
		const searching = !!state.dashboard.search.value;
		const items = searching
			? state.dashboard.search.results
			: state.dashboard.data;

		return {
			items,
			searching,
			finished: state.dashboard.finished,
		};
	}
);

export const selectCurrentRequestState = createSelector(
	selectDashboardState,
	(state: fromDashboard.State) => {
		return {
			id: state.dashboard.request.id,
			pending: state.dashboard.request.pending,
		};
	}
);

export const getSelectedItem = createSelector(
	selectDashboardState,
	(state: fromDashboard.State): Pokemon => state.selected
);
