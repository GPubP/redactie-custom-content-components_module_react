import { Preset } from '@redactie/content-types-module/dist/lib/services/presets';

export interface AddCCFormProps {
	className?: string;
	fieldTypeOptions: {
		key: string;
		label: string;
		value: string;
	}[];
	formState: AddCCFormState;
	onSubmit: (formValues: AddCCFormState) => void;
	presets: Preset[];
}

export interface AddCCFormState {
	fieldType: string;
	name: string;
}
