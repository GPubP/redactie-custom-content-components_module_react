import { parseSearchParams, SearchParams } from '@redactie/utils';

import { api } from '../api';

import { DEFAULT_PRESETS_SEARCH_PARAMS, PRESETS_PREFIX_URL } from './presets.service.const';
import { PresetDetailResponse, PresetsResponse } from './presets.service.types';

export class PresetsApiService {
	public async getPresets(
		searchParams: SearchParams = DEFAULT_PRESETS_SEARCH_PARAMS
	): Promise<PresetsResponse> {
		return api.get(`${PRESETS_PREFIX_URL}?${parseSearchParams(searchParams)}`).json();
	}

	public async getPreset(uuid: string): Promise<PresetDetailResponse> {
		return await api.get(`${PRESETS_PREFIX_URL}/${uuid}`).json();
	}
}

export const presetsApiService = new PresetsApiService();
