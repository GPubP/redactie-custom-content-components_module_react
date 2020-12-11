import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { DataLoader, RenderChildRoutes, useNavigate, useTenantContext } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { contentTypesConnector } from '../../connectors';
import { BREADCRUMB_OPTIONS, CUSTOM_CC_DETAIL_TABS, MODULE_PATHS } from '../../customCC.const';
import { CustomCCRouteProps } from '../../customCC.types';
import { useActiveTabs } from '../../hooks';

const CustomCCUpdate: FC<CustomCCRouteProps> = ({ location, route, match }) => {
	const { presetUuid } = match.params;
	/**
	 * Hooks
	 */

	const { tenantId } = useTenantContext();
	const { generatePath } = useNavigate();

	const [initialLoading, setInitialLoading] = useState(true);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	const activeTabs = useActiveTabs(CUSTOM_CC_DETAIL_TABS, location.pathname);
	const breadcrumbs = useBreadcrumbs(route.routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Content componenten', target: generatePath(MODULE_PATHS.overview) },
		],
	});
	const [activePreset] = contentTypesConnector.hooks.useActivePreset(presetUuid);
	const [, detailState] = contentTypesConnector.hooks.usePresetsUIStates();

	useEffect(() => {
		if (initialLoading && !detailState?.isFetching && activePreset) {
			setInitialLoading(false);
		}
	}, [activePreset, detailState, initialLoading]);

	/**
	 * Render
	 */

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			preset: activePreset,
		};

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	return (
		<>
			<ContextHeader tabs={activeTabs} title="Content component bewerken">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default CustomCCUpdate;
