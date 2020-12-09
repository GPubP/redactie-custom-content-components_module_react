import { Tab } from './customCC.types';

export const root = '/custom-content-componenten';

export const TENANT_ROOT = '/:tenantId';

export const MODULE_PATHS = {
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
};

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
