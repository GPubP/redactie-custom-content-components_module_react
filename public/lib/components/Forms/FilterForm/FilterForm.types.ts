import { FilterItem } from '../../../customCC.types';

export interface FilterFormState {
	name: string;
	status: string;
}

export interface FilterFormProps {
	initialState: FilterFormState;
	onCancel: () => void;
	onSubmit: (values: FilterFormState) => void;
	activeFilters: FilterItem[];
	clearActiveFilter: (item: FilterItem) => void;
}
