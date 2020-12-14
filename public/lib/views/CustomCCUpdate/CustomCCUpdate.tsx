import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	DataLoader,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { contentTypesConnector } from '../../connectors';
import { BREADCRUMB_OPTIONS, CUSTOM_CC_DETAIL_TABS, MODULE_PATHS } from '../../customCC.const';
import { CustomCCRouteProps, TabsLinkProps } from '../../customCC.types';
import { useActiveRouteConfig, useActiveTabs } from '../../hooks';

const CustomCCUpdate: FC<CustomCCRouteProps> = ({ location, route, match }) => {
	const { presetUuid } = match.params;

	/**
	 * Hooks
	 */

	const { tenantId } = useTenantContext();
	const { generatePath, navigate } = useNavigate();

	const [initialLoading, setInitialLoading] = useState(true);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	const activeRouteConfig = useActiveRouteConfig(location, route);
	const activeTabs = useActiveTabs(CUSTOM_CC_DETAIL_TABS, location.pathname);
	const breadcrumbs = useBreadcrumbs(route.routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Content componenten', target: generatePath(MODULE_PATHS.overview) },
		],
	});
	const [activePreset] = contentTypesConnector.hooks.useActivePreset(presetUuid);
	const [presetsLoading, presets] = contentTypesConnector.hooks.usePresets();
	const [, detailState] = (contentTypesConnector.hooks.usePresetsUIStates as any)(presetUuid);
	const [fieldTypesLoading, fieldTypes] = contentTypesConnector.hooks.useFieldTypes();
	const [fieldsHaveChanged] = useDetectValueChangesWorker(
		detailState && !detailState.isFetching,
		activePreset?.data?.fields,
		BFF_MODULE_PUBLIC_PATH
	);

	const pageTitle = useMemo(() => {
		if (!activeRouteConfig || typeof activeRouteConfig.title !== 'function') {
			return;
		}

		return activeRouteConfig.title(activePreset);
	}, [activePreset, activeRouteConfig]);

	// Fetch fieldTypes and presets
	useEffect(() => {
		contentTypesConnector.fieldTypesFacade.getFieldTypes();
		contentTypesConnector.presetsFacade.getPresets();
	}, []);

	// Set initial loading
	useEffect(() => {
		if (
			initialLoading &&
			!presetsLoading &&
			!fieldTypesLoading &&
			detailState &&
			!detailState.isFetching &&
			activePreset &&
			fieldTypes &&
			presets
		) {
			return setInitialLoading(false);
		}
	}, [
		fieldTypes,
		presets,
		presetsLoading,
		fieldTypesLoading,
		initialLoading,
		detailState,
		activePreset,
	]);

	/**
	 * Methods
	 */

	const onCancel = (): void => {
		navigate(MODULE_PATHS.overview);
	};

	/**
	 * Render
	 */

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			fieldTypes,
			fieldsHaveChanged,
			preset: activePreset,
			presets,
			onCancel,
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
			<ContextHeader
				linkProps={(props: TabsLinkProps) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.detail}/${props.href}`, {
						presetUuid,
					}),
					component: Link,
				})}
				tabs={activeTabs}
				title={pageTitle}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default CustomCCUpdate;
