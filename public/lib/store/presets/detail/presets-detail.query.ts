import { CacheEntityQuery } from '@redactie/utils';

import { PresetsDetailState, PresetsDetailUIState } from './presets-detail.model';
import { PresetsDetailStore, presetsDetailStore } from './presets-detail.store';

export class PresetsDetailQuery extends CacheEntityQuery<PresetsDetailUIState, PresetsDetailState> {
	constructor(protected store: PresetsDetailStore) {
		super(store);
	}
}

export const presetsDetailQuery = new PresetsDetailQuery(presetsDetailStore);
