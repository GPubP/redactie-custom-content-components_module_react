import { MODULE_PATHS } from '../../customCC.const';
import { CompartmentModel, CompartmentType } from '../../store/compartments';

export const NEW_CC_COMPARTMENTS: CompartmentModel[] = [
	{
		name: 'settings',
		label: 'Instellingen',
		slug: MODULE_PATHS.detailCCNewSettingsCC,
		type: CompartmentType.INTERNAL,
		isValid: false,
		validate: values => false,
	},
	{
		name: 'configuration',
		label: 'Configuratie',
		slug: MODULE_PATHS.detailCCNewConfigCC,
		type: CompartmentType.INTERNAL,
		isValid: false,
		filter: ccField => !!ccField?.data?.formSchema?.fields?.length,
		validate: values => false,
	},
	{
		name: 'validation',
		label: 'Validatie',
		slug: MODULE_PATHS.detailCCNewValidationCC,
		type: CompartmentType.INTERNAL,
		isValid: false,
		filter: ccField => !!ccField?.data?.validators?.length,
		validate: values => false,
	},
];
