import { OverviewFilterItem } from '../../../customCC.types';

export interface FilterFormState {
	name: string;
	status: string;
}

export interface FilterFormProps {
	initialState: FilterFormState;
	onCancel: () => void;
	onSubmit: (values: FilterFormState) => void;
	activeFilters: OverviewFilterItem[];
	clearActiveFilter: (item: OverviewFilterItem) => void;
}

export enum FilterFormStatus {
	Active = 'active',
	NonActive = 'non-active',
}
