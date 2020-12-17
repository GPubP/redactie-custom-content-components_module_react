import { contentTypesConnector } from '../../connectors';
import { MODULE_PATHS, TENANT_ROOT } from '../../customCC.const';
import { CompartmentModel, CompartmentType } from '../../store/compartments';

export const UPDATE_DYNAMIC_FIELD_COMPARTMENTS: CompartmentModel[] = [
	{
		label: 'Instellingen',
		name: 'settings',
		slug: MODULE_PATHS.detailCCUpdateDynamicFieldSettings,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: values =>
			contentTypesConnector.helpers.settingsCompartmentValidator(values as any),
	},
	{
		label: 'Configuratie',
		name: 'configuration',
		slug: MODULE_PATHS.detailCCUpdateDynamicFieldConfig,
		filter: CtField => !!CtField?.data?.formSchema?.fields?.length,
		type: CompartmentType.INTERNAL,
		validate: (values: any, meta: any) =>
			contentTypesConnector.helpers.configurationCompartmentValidator(
				values,
				meta.fieldType,
				meta.preset
			),
	},
	{
		label: 'Validatie',
		name: 'validation',
		slug: MODULE_PATHS.detailCCUpdateDynamicFieldValidation,
		filter: CtField => !!CtField?.data?.validators?.length,
		type: CompartmentType.INTERNAL,
		validate: (values: any, meta: any) =>
			contentTypesConnector.helpers.validationCompartmentValidator(
				values,
				meta.fieldType,
				meta.preset
			),
	},
];

export const UPDATE_DYNAMIC_FIELD_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateField}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateFieldConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewField}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewFieldConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateDynamicField}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateDynamicFieldSettings}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateDynamicFieldConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateDynamicFieldValidation}`,
];
