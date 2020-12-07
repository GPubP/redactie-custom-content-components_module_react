import { CacheEntityState } from '@redactie/utils';

import { Preset } from '../../../services/presets';

export type PresetListModel = Preset;

export type PresetsListState = CacheEntityState<PresetListModel, string>;
