export interface FilterFormState {
	name: string;
	status: string;
}

export interface FilterFormProps {
	initialState: FilterFormState;
	onCancel: () => void;
	onSubmit: () => void;
	activeFilters: any[];
	clearActiveFilter: (item: any) => void;
}
