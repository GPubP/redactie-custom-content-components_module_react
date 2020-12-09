export interface FilterFormState {
	name: string;
	status: string;
}

export interface FilterFormProps {
	initialState: FilterFormState;
	onCancel: () => void;
	onSubmit: (values: FilterFormState) => void;
	activeFilters: any[];
	clearActiveFilter: (item: any) => void;
}
