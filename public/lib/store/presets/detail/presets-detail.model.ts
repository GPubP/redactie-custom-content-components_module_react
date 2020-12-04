import { CacheEntityState, CacheEntityUI, CacheEntityUIState } from '@redactie/utils';

import { PresetDetailResponse } from '../../../services/presets';

export type PresetDetailModel = PresetDetailResponse;
export type PresetDetailUIModel = CacheEntityUI;

export type PresetsDetailState = CacheEntityState<PresetDetailModel, string>;

export type PresetsDetailUIState = CacheEntityUIState<PresetDetailUIModel>;
