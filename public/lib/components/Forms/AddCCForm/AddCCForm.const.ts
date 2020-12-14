import { PresetDetailModel } from '@redactie/content-types-module';
import { object, string } from 'yup';

export const FIELD_TYPES_DEFAULT_OPTION = {
	key: 'default-option',
	label: 'Selecteer een content component',
	value: '',
	disabled: true,
};

export const ADD_CC_FORM_VALIDATION_SCHEMA = (presets?: PresetDetailModel[]): any =>
	object().shape({
		name: string().required('Naam is een verplicht veld'),
		// .test({
		// 	name: 'No duplicate',
		// 	message: value => `Naam ${value.originalValue} bestaat reeds`,
		// 	test: name => !presets.find(preset => preset.data.fields.find(f => f.label === name)),
		// }),
	});
