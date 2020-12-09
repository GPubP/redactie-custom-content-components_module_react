import { NavigateFn } from '@redactie/utils';

export interface OverviewTableRow {
	uuid: string;
	name: string;
	description: string;
	active: boolean;
	navigate: NavigateFn;
}
