import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import {
	PresetDetailModel,
	PresetsDetailState,
	PresetsDetailUIState,
} from './presets-detail.model';

@StoreConfig({ name: 'ccc-presets-detail', idKey: 'uuid' })
export class PresetsDetailStore extends CacheEntityStore<
	PresetsDetailUIState,
	PresetsDetailState,
	PresetDetailModel
> {}

export const presetsDetailStore = new PresetsDetailStore();
