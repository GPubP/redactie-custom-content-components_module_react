import Core from '@redactie/redactie-core';
import { RenderChildRoutes, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';

import { DynamicFieldBreadCrumb, PresetBreadCrumb } from './lib/components';
import { contentTypesConnector } from './lib/connectors';
import { CONTEXT_HEADER_ROUTE_BAGES, MODULE_PATHS } from './lib/customCC.const';
import { ModuleProps, PageType } from './lib/customCC.types';
import { getPageTitle } from './lib/helpers';
import {
	CreateView,
	DetailCCNewDynamicFieldView,
	DetailCCNewFieldView,
	DetailCCUpdateDynamicFieldView,
	DetailCCUpdateFieldView,
	DetailCCView,
	DetailSettingsView,
	OverviewView,
	UpdateView,
} from './lib/views';

const CustomCCComponent: FC<ModuleProps> = ({ route, tenantId }) => {
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	return (
		<TenantContext.Provider value={{ tenantId }}>
			<RenderChildRoutes routes={route.routes} guardsMeta={guardsMeta} />
		</TenantContext.Provider>
	);
};

Core.routes.register({
	path: MODULE_PATHS.root,
	component: CustomCCComponent,
	breadcrumb: null,
	navigation: {
		label: 'Content componenten',
		order: 1,
		parentPath: MODULE_PATHS.contentTypes,
	},
	redirect: MODULE_PATHS.overview,
	routes: [
		{
			path: MODULE_PATHS.overview,
			component: OverviewView,
		},
		{
			path: MODULE_PATHS.create,
			component: CreateView,
			breadcrumb: null,
			redirect: MODULE_PATHS.createSettings,
			routes: [
				{
					path: MODULE_PATHS.createSettings,
					component: DetailSettingsView,
				},
			],
		},
		{
			path: MODULE_PATHS.detail,
			breadcrumb: null,
			component: UpdateView,
			redirect: MODULE_PATHS.detailSettings,
			routes: [
				{
					path: MODULE_PATHS.detailCCNewDynamicField,
					breadcrumb: DynamicFieldBreadCrumb,
					component: DetailCCNewDynamicFieldView,
					redirect: MODULE_PATHS.detailCCNewDynamicFieldSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCNewDynamicFieldSettings,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCNewDynamicFieldConfig,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCNewDynamicFieldValidation,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCValidation,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCUpdateDynamicField,
					breadcrumb: DynamicFieldBreadCrumb,
					component: DetailCCUpdateDynamicFieldView,
					redirect: MODULE_PATHS.detailCCUpdateDynamicFieldSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCUpdateDynamicFieldSettings,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCUpdateDynamicFieldConfig,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCUpdateDynamicFieldValidation,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCValidation,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCNewField,
					breadcrumb: null,
					component: DetailCCNewFieldView,
					redirect: MODULE_PATHS.detailCCNewFieldSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCNewFieldSettings,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
						{
							path: MODULE_PATHS.detailCCNewFieldConfig,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
						{
							path: MODULE_PATHS.detailCCNewFieldValidation,
							component: contentTypesConnector.views.tenant.ContentTypesCCValidation,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCUpdateField,
					breadcrumb: null,
					component: DetailCCUpdateFieldView,
					redirect: MODULE_PATHS.detailCCUpdateFieldSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCUpdateFieldSettings,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
						{
							path: MODULE_PATHS.detailCCUpdateFieldConfig,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
						{
							path: MODULE_PATHS.detailCCUpdateFieldValidation,
							component: contentTypesConnector.views.tenant.ContentTypesCCValidation,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
					],
				},
				{
					path: MODULE_PATHS.detailSettings,
					component: DetailSettingsView,
					title: getPageTitle(PageType.Preset),
				},
				{
					path: MODULE_PATHS.detailCC,
					component: DetailCCView,
					breadcrumb: PresetBreadCrumb,
					title: getPageTitle(PageType.Preset),
					badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
				},
			],
		},
	],
});
