export interface AddCCFormProps {
	className?: string;
	fieldTypeOptions: {
		key: string;
		label: string;
		value: string;
	}[];
	formState: AddCCFormState;
	onSubmit: (formValues: AddCCFormState) => void;
	// [elementProp: string]: unknown;
}

export interface AddCCFormState {
	fieldType: string;
	name: string;
}
