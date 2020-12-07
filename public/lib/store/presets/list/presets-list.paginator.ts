import { PaginatorPlugin } from '@datorama/akita';

import { presetsListQuery } from './presets-list.query';

export const presetsListPaginator = new PaginatorPlugin(presetsListQuery)
	.withControls()
	.withRange();
