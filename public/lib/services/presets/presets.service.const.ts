import { SearchParams } from '@redactie/utils';

export const PRESETS_PREFIX_URL = 'content/v1/presets';

export const DEFAULT_PRESETS_SEARCH_PARAMS: SearchParams = {
	skip: 0,
	limit: -1,
	hidden: false,
};
