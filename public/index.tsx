import Core from '@redactie/redactie-core';
import { RenderChildRoutes, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';

import { DynamicFieldBreadCrumb, PresetBreadCrumb } from './lib/components';
import { contentTypesConnector, rolesRightsConnector } from './lib/connectors';
import { MODULE_PATHS } from './lib/customCC.const';
import { ModuleProps, PageType } from './lib/customCC.types';
import { getPageBadges, getPageTitle } from './lib/helpers';
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
	breadcrumb: false,
	guardOptions: {
		guards: [
			rolesRightsConnector.api.guards.securityRightsTenantGuard([
				rolesRightsConnector.securityRights.read,
			]),
		],
	},
	navigation: {
		label: 'Content componenten',
		order: 2,
		parentPath: MODULE_PATHS.contentTypes,
		canShown: [
			rolesRightsConnector.api.canShowns.securityRightsTenantCanShown([
				rolesRightsConnector.securityRights.read,
			]),
		],
	},
	redirect: MODULE_PATHS.overview,
	routes: [
		{
			path: MODULE_PATHS.overview,
			breadcrumb: false,
			component: OverviewView,
		},
		{
			path: MODULE_PATHS.create,
			component: CreateView,
			breadcrumb: false,
			redirect: MODULE_PATHS.createSettings,
			guardOptions: {
				guards: [
					rolesRightsConnector.api.guards.securityRightsTenantGuard([
						rolesRightsConnector.securityRights.create,
					]),
				],
			},
			routes: [
				{
					path: MODULE_PATHS.createSettings,
					component: DetailSettingsView,
					breadcrumb: false,
				},
			],
		},
		{
			path: MODULE_PATHS.detail,
			breadcrumb: false,
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
							breadcrumb: false,
							title: getPageTitle(PageType.DynamicField),
							badges: getPageBadges(PageType.DynamicField),
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCNewDynamicFieldConfig,
							breadcrumb: false,
							title: getPageTitle(PageType.DynamicField),
							badges: getPageBadges(PageType.DynamicField),
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCNewDynamicFieldValidation,
							breadcrumb: false,
							title: getPageTitle(PageType.DynamicField),
							badges: getPageBadges(PageType.DynamicField),
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
							breadcrumb: false,
							title: getPageTitle(PageType.DynamicField),
							badges: getPageBadges(PageType.DynamicField),
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
						},
						{
							path: MODULE_PATHS.detailCCUpdateDynamicFieldConfig,
							breadcrumb: false,
							title: getPageTitle(PageType.DynamicField),
							badges: getPageBadges(PageType.DynamicField),
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
						},
						{
							path: MODULE_PATHS.detailCCUpdateDynamicFieldValidation,
							breadcrumb: false,
							title: getPageTitle(PageType.DynamicField),
							badges: getPageBadges(PageType.DynamicField),
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
							breadcrumb: false,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
							title: getPageTitle(PageType.Field),
							badges: getPageBadges(PageType.Field),
						},
						{
							path: MODULE_PATHS.detailCCNewFieldConfig,
							breadcrumb: false,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
							title: getPageTitle(PageType.Field),
							badges: getPageBadges(PageType.Field),
						},
						{
							path: MODULE_PATHS.detailCCNewFieldValidation,
							breadcrumb: false,
							component: contentTypesConnector.views.tenant.ContentTypesCCValidation,
							title: getPageTitle(PageType.Field),
							badges: getPageBadges(PageType.Field),
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
							breadcrumb: false,
							component: contentTypesConnector.views.tenant.ContentTypesCCSettings,
							title: getPageTitle(PageType.Field),
							badges: getPageBadges(PageType.Field),
						},
						{
							path: MODULE_PATHS.detailCCUpdateFieldConfig,
							breadcrumb: false,
							component: contentTypesConnector.views.tenant.ContentTypesCCConfig,
							title: getPageTitle(PageType.Field),
							badges: getPageBadges(PageType.Field),
						},
						{
							path: MODULE_PATHS.detailCCUpdateFieldValidation,
							breadcrumb: false,
							component: contentTypesConnector.views.tenant.ContentTypesCCValidation,
							title: getPageTitle(PageType.Field),
							badges: getPageBadges(PageType.Field),
						},
					],
				},
				{
					path: MODULE_PATHS.detailSettings,
					component: DetailSettingsView,
					breadcrumb: false,
					title: getPageTitle(PageType.Preset),
					badges: getPageBadges(PageType.Preset),
				},
				{
					path: MODULE_PATHS.detailCC,
					component: DetailCCView,
					breadcrumb: false,
					title: getPageTitle(PageType.Preset),
					badges: getPageBadges(PageType.Preset),
				},
			],
		},
	],
});
