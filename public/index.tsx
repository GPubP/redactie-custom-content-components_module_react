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
			breadcrumb: null,
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
					breadcrumb: null,
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
							breadcrumb: null,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCNewDynamicFieldConfig,
							breadcrumb: null,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCNewDynamicFieldValidation,
							breadcrumb: null,
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
							breadcrumb: null,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCUpdateDynamicFieldConfig,
							breadcrumb: null,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCUpdateDynamicFieldValidation,
							breadcrumb: null,
							title: getPageTitle(PageType.DynamicField),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
							component: contentTypesConnector.views.tenant.ContentTypesCCValidation,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCNewField,
					breadcrumb: PresetBreadCrumb,
					component: DetailCCNewFieldView,
					redirect: MODULE_PATHS.detailCCNewFieldSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCNewFieldSettings,
							breadcrumb: null,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
						{
							path: MODULE_PATHS.detailCCNewFieldConfig,
							breadcrumb: null,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
						{
							path: MODULE_PATHS.detailCCNewFieldValidation,
							breadcrumb: null,
							component: contentTypesConnector.views.tenant.ContentTypesCCValidation,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
					],
				},
				{
					path: MODULE_PATHS.detailCCUpdateField,
					breadcrumb: PresetBreadCrumb,
					component: DetailCCUpdateFieldView,
					redirect: MODULE_PATHS.detailCCUpdateFieldSettings,
					routes: [
						{
							path: MODULE_PATHS.detailCCUpdateFieldSettings,
							breadcrumb: null,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
						{
							path: MODULE_PATHS.detailCCUpdateFieldConfig,
							breadcrumb: null,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
						{
							path: MODULE_PATHS.detailCCUpdateFieldValidation,
							breadcrumb: null,
							component: contentTypesConnector.views.tenant.ContentTypesCCValidation,
							title: getPageTitle(PageType.Field),
							badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
						},
					],
				},
				{
					path: MODULE_PATHS.detailSettings,
					component: DetailSettingsView,
					breadcrumb: null,
					title: getPageTitle(PageType.Preset),
				},
				{
					path: MODULE_PATHS.detailCC,
					component: DetailCCView,
					breadcrumb: null,
					// breadcrumb: PresetBreadCrumb,
					title: getPageTitle(PageType.Preset),
					badges: CONTEXT_HEADER_ROUTE_BAGES.detailCC,
				},
			],
		},
	],
});
