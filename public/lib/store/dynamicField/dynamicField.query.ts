import { Query } from '@datorama/akita';
import { distinctUntilChanged } from 'rxjs/operators';

import { DynamicFieldState } from './dynamicField.model';
import { DynamicFieldStore, dynamicFieldStore } from './dynamicField.store';

export class DynamicFieldQuery extends Query<DynamicFieldState> {
	constructor(protected store: DynamicFieldStore) {
		super(store);
	}

	public dynamicField$ = this.select(state => state.dynamicField).pipe(distinctUntilChanged());
	public activeField$ = this.select(state => state.activeField).pipe(distinctUntilChanged());
}

export const dynamicFieldQuery = new DynamicFieldQuery(dynamicFieldStore);
