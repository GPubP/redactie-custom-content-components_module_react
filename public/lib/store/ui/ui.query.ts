import { Query } from '@datorama/akita';
import { distinctUntilChanged } from 'rxjs/operators';

import { UIState } from './ui.model';
import { UIStore, uiStore } from './ui.store';

export class UIQuery extends Query<UIState> {
	constructor(protected store: UIStore) {
		super(store);
	}

	public activeField$ = this.select(state => state.activeField).pipe(distinctUntilChanged());
}

export const uiQuery = new UIQuery(uiStore);
