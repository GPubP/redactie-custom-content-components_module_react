import { PaginationResponse } from '@datorama/akita';
import { SearchParams } from '@redactie/utils';

import { PresetListModel } from '../../store/presets';

export type UsePresetsPagination = (
	sitesSearchParams: SearchParams,
	clearCache?: boolean
) => {
	loading: boolean;
	pagination: PaginationResponse<PresetListModel> | null;
	refreshCurrentPage: () => void;
	error: any | null;
};
