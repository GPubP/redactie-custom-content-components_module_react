import { BreadcrumbOptions } from '@redactie/redactie-core';
import { NavigateGenerateFn } from '@redactie/utils';

import { Tab } from './customCC.types';

export const TENANT_ROOT = '/:tenantId';
export const root = '/content-componenten';

export const MODULE_PATHS = {
	admin: '/dashboard',
	contentTypes: '/content-types',

	root,
	overview: `${root}/overzicht`,

	create: `${root}/aanmaken`,
	createSettings: `${root}/aanmaken/instellingen`,

	detail: `${root}/:presetUuid`,
	detailSettings: `${root}/:presetUuid/instellingen`,
	detailCC: `${root}/:presetUuid/content-componenten`,
};

export const ALERT_CONTAINER_IDS = {
	create: 'custom-cc-create',
	detailSettings: 'custom-cc-detail-settings',
};

export const BREADCRUMB_OPTIONS = (generatePath: NavigateGenerateFn): BreadcrumbOptions => ({
	excludePaths: [
		'/',
		`${TENANT_ROOT}`,
		`${TENANT_ROOT}/content-componenten`,
		`${TENANT_ROOT}/content-componenten/aanmaken`,
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
		// containerId: ALERT_CONTAINER_IDS.detailSettings,
	},
	contentComponents: {
		name: 'Content Componenten',
		target: 'content-componenten',
		active: false,
		// containerId: ALERT_CONTAINER_IDS.detailCC,
	},
};

export const CUSTOM_CC_DETAIL_TABS: Tab[] = [
	CUSTOM_CC_DETAIL_TAB_MAP.settings,
	CUSTOM_CC_DETAIL_TAB_MAP.contentComponents,
];
