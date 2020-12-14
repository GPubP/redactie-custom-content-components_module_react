import { Preset } from '@redactie/content-types-module/dist/lib/services/presets';
import { object, string } from 'yup';

export const FIELD_TYPES_DEFAULT_OPTION = {
	key: 'default-option',
	label: 'Selecteer een content component',
	value: '',
	disabled: true,
};

export const ADD_CC_FORM_VALIDATION_SCHEMA = (presets: Preset[]): any =>
	object().shape({
		name: string()
			.required('Naam is een verplicht veld')
			.test({
				name: 'No duplicate',
				message: value => `Naam ${value.originalValue} bestaat reeds`,
				test: name =>
					!presets.find(preset => preset.data.fields.find(f => f.field.label === name)),
			}),
	});
