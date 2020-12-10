import { object, string } from 'yup';

export const CUSTOM_CC_SETTINGS_VALIDATION_SCHEMA = object().shape({
	data: object().shape({
		label: string().required('Naam is een verplicht veld'),
		description: string(),
	}),
});
