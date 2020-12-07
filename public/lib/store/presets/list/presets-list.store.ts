import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import { PresetListModel, PresetsListState } from './presets-list.model';

@StoreConfig({ name: 'ccc-presets-list', idKey: 'uuid' })
export class PresetsListStore extends CacheEntityStore<any, PresetsListState, PresetListModel> {}

export const presetsListStore = new PresetsListStore();
