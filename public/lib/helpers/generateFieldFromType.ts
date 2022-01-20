import { Field, FieldTypeDetailModel, PresetDetailModel } from '@redactie/content-types-module';
import { v4 as uuidv4 } from 'uuid';

import { contentTypesConnector } from '../connectors';

export const generateFieldFromType = (
	fieldType: FieldTypeDetailModel,
	initialValues: Partial<Omit<Field, 'compartment'>> = {},
	preset?: PresetDetailModel
): Omit<Field, 'compartment'> => {
	// Generate default validation checks
	const validation = contentTypesConnector.helpers.generateValidationChecks(
		{},
		fieldType.data,
		preset
	);
	// Generate formdata based on these checks (needed for config generation)
	const validationData = contentTypesConnector.helpers.createInitialValuesFromChecks(
		validation.checks
	);
	// Generate baseConfig
	const baseConfig = contentTypesConnector.helpers.generateConfig(fieldType.data, preset);
	// Enrich the baseConfig with required settings
	const config = contentTypesConnector.helpers.generateConfigFromValidationData(
		validationData,
		preset,
		baseConfig,
		preset
			? contentTypesConnector.helpers.generateFormSchemaFromPreset(preset)
			: contentTypesConnector.helpers.generateFormSchemaFromFieldTypeData(fieldType.data)
	);

	return {
		__new: true,
		uuid: uuidv4(),
		label: '',
		module: fieldType.data.module || '',
		name: '',
		config,
		validators: [],
		validation,
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
	};
};
