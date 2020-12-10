import Core from '@redactie/redactie-core';
import { RenderChildRoutes, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';

import { MODULE_PATHS } from './lib/customCC.const';
import { CustomCCModuleProps } from './lib/customCC.types';
import {
	CustomCCCreate,
	CustomCCDetailCC,
	CustomCCDetailSettings,
	CustomCCOverview,
	CustomCCUpdate,
} from './lib/views';

const CustomCCComponent: FC<CustomCCModuleProps> = ({ route, tenantId }) => {
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
	redirect: MODULE_PATHS.overview,
	routes: [
		{
			path: MODULE_PATHS.overview,
			component: CustomCCOverview,
			navigation: {
				label: 'Content componenten',
				order: 1,
				parentPath: MODULE_PATHS.contentTypes,
			},
		},
		{
			path: MODULE_PATHS.create,
			component: CustomCCCreate,
			breadcrumb: null,
			redirect: MODULE_PATHS.createSettings,
			routes: [
				{
					path: MODULE_PATHS.createSettings,
					component: CustomCCDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.detail,
			breadcrumb: null,
			component: CustomCCUpdate,
			redirect: MODULE_PATHS.detailSettings,
			routes: [
				{
					path: MODULE_PATHS.detailSettings,
					component: CustomCCDetailSettings,
				},
				{
					path: MODULE_PATHS.detailCC,
					component: CustomCCDetailCC,
				},
			],
		},
	],
});
