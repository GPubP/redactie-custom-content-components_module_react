import { Store, StoreConfig } from '@datorama/akita';

import { UIState } from './ui.model';

@StoreConfig({ name: 'CCC-ui' })
export class UIStore extends Store<UIState> {
	constructor() {
		super({});
	}
}

export const uiStore = new UIStore();
