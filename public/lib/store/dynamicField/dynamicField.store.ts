import { Store, StoreConfig } from '@datorama/akita';

import { DynamicFieldState } from './dynamicField.model';

@StoreConfig({ name: 'ccc-dynamicFields', idKey: 'uuid' })
export class DynamicFieldStore extends Store<DynamicFieldState> {
	constructor() {
		super({});
	}
}

export const dynamicFieldStore = new DynamicFieldStore();
