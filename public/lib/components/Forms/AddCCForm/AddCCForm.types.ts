import { PresetDetailModel } from '@redactie/content-types-module';

export interface AddCCFormProps {
	className?: string;
	fieldTypeOptions: {
		key: string;
		label: string;
		value: string;
	}[];
	formState: AddCCFormState;
	onSubmit: (formValues: AddCCFormState) => void;
	preset: PresetDetailModel;
}

export interface AddCCFormState {
	fieldType: string;
	name: string;
}
