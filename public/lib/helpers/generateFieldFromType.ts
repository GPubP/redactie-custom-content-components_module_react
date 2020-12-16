import { Field, FieldTypeDetailModel, PresetDetailModel } from '@redactie/content-types-module';
import { v4 as uuidv4 } from 'uuid';

import { contentTypesConnector } from '../connectors';

export const generateFieldFromType = (
	fieldType: FieldTypeDetailModel,
	initialValues: Partial<Omit<Field, 'compartment'>> = {},
	preset?: PresetDetailModel
): Omit<Field, 'compartment'> => ({
	__new: true,
	uuid: uuidv4(),
	label: '',
	module: fieldType.data.module || '',
	name: '',
	config: contentTypesConnector.helpers.generateConfig(fieldType.data, preset),
	validators: [],
	validation: contentTypesConnector.helpers.generateValidationChecks(
		{},
		fieldType.data,
		preset,
		true
	),
	operators: [],
	...initialValues,
	generalConfig: {
		guideline: '',
		required: false,
		hidden: false,
		min: 0,
		max: 1,
		...initialValues.generalConfig,
	},
	dataType: fieldType.data.dataType,
	fieldType,
	preset,
});
