import { contentTypesConnector } from '../../connectors';
import { MODULE_PATHS, TENANT_ROOT } from '../../customCC.const';
import { CompartmentModel, CompartmentType } from '../../store/compartments';

export const UPDATE_FIELD_COMPARTMENTS: CompartmentModel[] = [
	{
		name: 'settings',
		label: 'Instellingen',
		slug: MODULE_PATHS.detailCCUpdateFieldSettings,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: values =>
			contentTypesConnector.helpers.settingsCompartmentValidator(values as any),
	},
	{
		name: 'configuration',
		label: 'Configuratie',
		slug: MODULE_PATHS.detailCCUpdateFieldConfig,
		type: CompartmentType.INTERNAL,
		isValid: false,
		filter: ccField => !!ccField?.data?.formSchema?.fields?.length,
		validate: (values: any, meta: any) =>
			contentTypesConnector.helpers.configurationCompartmentValidator(
				values,
				meta.fieldType,
				meta.preset,
				meta.languages
			),
	},
	{
		name: 'validation',
		label: 'Validatie',
		slug: MODULE_PATHS.detailCCUpdateFieldValidation,
		type: CompartmentType.INTERNAL,
		isValid: false,
		filter: ccField => !!ccField?.data?.validators?.length,
		validate: (values: any, meta: any) =>
			contentTypesConnector.helpers.validationCompartmentValidator(
				values,
				meta.fieldType,
				meta.preset
			),
	},
];

export const UPDATE_FIELD_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCC}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateField}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateFieldSettings}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateFieldConfig}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateFieldValidation}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewDynamicField}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewDynamicFieldSettings}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateDynamicField}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateDynamicFieldSettings}`,
];
