import { BreadcrumbOptions } from '@redactie/redactie-core';
import { ContextHeaderBadge, NavigateGenerateFn } from '@redactie/utils';

import { Tab } from './customCC.types';

export const TENANT_ROOT = '/:tenantId';
export const root = '/content-componenten';
export const BASE_DETAIL_PATH = `${root}/:presetUuid`;
export const DETAIL_CC_PATH = `${BASE_DETAIL_PATH}/content-componenten`;
export const FIELD_NEW_PATH = `${DETAIL_CC_PATH}/aanmaken`;
export const FIELD_UPDATE_PATH = `${DETAIL_CC_PATH}/:contentComponentUuid/bewerken`;
export const DYNAMIC_FIELD_BASE_PATH = `${FIELD_UPDATE_PATH}/dynamisch`;
export const DYNAMIC_FIELD_NEW_PATH = `${DYNAMIC_FIELD_BASE_PATH}/aanmaken`;
export const DYNAMIC_FIELD_UPDATE_PATH = `${DYNAMIC_FIELD_BASE_PATH}/:dynamicContentComponentUuid/bewerken`;

export const MODULE_PATHS = {
	admin: '/dashboard',
	contentTypes: '/:ctType(content-types|content-blokken)',

	root,
	overview: `${root}/overzicht`,

	create: `${root}/aanmaken`,
	createSettings: `${root}/aanmaken/instellingen`,

	detail: BASE_DETAIL_PATH,
	detailSettings: `${BASE_DETAIL_PATH}/instellingen`,
	detailCC: DETAIL_CC_PATH,

	detailCCNewField: FIELD_NEW_PATH,
	detailCCNewFieldSettings: `${FIELD_NEW_PATH}/instellingen`,
	detailCCNewFieldConfig: `${FIELD_NEW_PATH}/configuratie`,
	detailCCNewFieldValidation: `${FIELD_NEW_PATH}/validatie`,

	detailCCUpdateField: FIELD_UPDATE_PATH,
	detailCCUpdateFieldSettings: `${FIELD_UPDATE_PATH}/instellingen`,
	detailCCUpdateFieldConfig: `${FIELD_UPDATE_PATH}/configuratie`,
	detailCCUpdateFieldValidation: `${FIELD_UPDATE_PATH}/validatie`,

	detailCCNewDynamicField: DYNAMIC_FIELD_NEW_PATH,
	detailCCNewDynamicFieldSettings: `${DYNAMIC_FIELD_NEW_PATH}/instellingen`,
	detailCCNewDynamicFieldConfig: `${DYNAMIC_FIELD_NEW_PATH}/configuratie`,
	detailCCNewDynamicFieldValidation: `${DYNAMIC_FIELD_NEW_PATH}/validatie`,

	detailCCUpdateDynamicField: DYNAMIC_FIELD_UPDATE_PATH,
	detailCCUpdateDynamicFieldSettings: `${DYNAMIC_FIELD_UPDATE_PATH}/instellingen`,
	detailCCUpdateDynamicFieldConfig: `${DYNAMIC_FIELD_UPDATE_PATH}/configuratie`,
	detailCCUpdateDynamicFieldValidation: `${DYNAMIC_FIELD_UPDATE_PATH}/validatie`,
};

export const ALERT_CONTAINER_IDS = {
	create: 'custom-cc-create',
	detailSettings: 'custom-cc-detail-settings',
	detailCC: 'custom-cc-detail-cc',
	detailCCNewField: 'custom-cc-detail-cc-new-field',
	detailCCUpdateField: 'custom-cc-detail-cc-update-field',
	detailCCNewDynamicField: 'custom-cc-detail-cc-new-dynamic-field',
	detailCCUpdateDynamicField: 'custom-cc-detail-cc-update-dynamic-field',
};

export const BREADCRUMB_OPTIONS = (generatePath: NavigateGenerateFn): BreadcrumbOptions => ({
	excludePaths: [
		'/',
		`${TENANT_ROOT}`,
		`${TENANT_ROOT}${DETAIL_CC_PATH}/:contentComponentUuid([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})`,
		`${TENANT_ROOT}${DYNAMIC_FIELD_BASE_PATH}`,
		`${TENANT_ROOT}${DYNAMIC_FIELD_BASE_PATH}/:dynamicContentComponentUuid([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})`,
	],
	extraBreadcrumbs: [
		{
			name: 'Home',
			target: generatePath(MODULE_PATHS.admin),
		},
		{
			name: 'Structuur',
			target: '',
		},
	],
});

export const CUSTOM_CC_DETAIL_TAB_MAP = {
	settings: {
		name: 'Instellingen',
		target: 'instellingen',
		active: true,
		disabled: false,
		containerId: ALERT_CONTAINER_IDS.detailSettings,
	},
	contentComponents: {
		name: 'Content componenten',
		target: 'content-componenten',
		active: false,
		disabled: false,
		containerId: ALERT_CONTAINER_IDS.detailCC,
	},
};

export const CUSTOM_CC_DETAIL_TABS: Tab[] = [
	CUSTOM_CC_DETAIL_TAB_MAP.settings,
	CUSTOM_CC_DETAIL_TAB_MAP.contentComponents,
];

export const CONTEXT_HEADER_ROUTE_BAGES: Record<'detailCC', ContextHeaderBadge[]> = {
	detailCC: [
		{
			name: 'Content component',
			type: 'primary',
		},
	],
};
