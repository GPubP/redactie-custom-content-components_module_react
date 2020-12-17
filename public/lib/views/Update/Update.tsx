import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { PresetDetailModel } from '@redactie/content-types-module';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	DataLoader,
	RenderChildRoutes,
	useActiveRouteConfig,
	useDetectValueChangesWorker,
	useNavigate,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { contentTypesConnector } from '../../connectors';
import { BREADCRUMB_OPTIONS, CUSTOM_CC_DETAIL_TABS, MODULE_PATHS } from '../../customCC.const';
import { RouteProps, Tab, TabsLinkProps } from '../../customCC.types';
import { useActiveField, useActiveTabs, useDynamicField } from '../../hooks';

const UpdateView: FC<RouteProps> = ({ location, route, match }) => {
	const { presetUuid } = match.params;
	const showTabs = !/\/(aanmaken|bewerken)\//.test(location.pathname);

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
	const dynamicField = useDynamicField();
	const activeField = useActiveField();
	const [activePreset] = contentTypesConnector.hooks.usePreset(presetUuid);
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

		return activeRouteConfig.title(activePreset, activeField, dynamicField);
	}, [activeField, activePreset, activeRouteConfig, dynamicField]);

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

	const onSubmit = (data: PresetDetailModel, tab: Tab): void => {
		contentTypesConnector.presetsFacade.updatePreset(
			{
				uuid: data.uuid,
				body: {
					data: data.data,
				} as any,
			},
			{
				alertContainerId: tab.containerId,
			}
		);
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
			onSubmit,
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
				tabs={showTabs && activeTabs}
				badges={activeRouteConfig && activeRouteConfig.badges}
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

export default UpdateView;
