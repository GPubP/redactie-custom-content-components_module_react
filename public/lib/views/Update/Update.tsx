import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { PresetDetailModel } from '@redactie/content-types-module';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	ContextHeaderBadge,
	ContextHeaderTabLinkProps,
	DataLoader,
	RenderChildRoutes,
	useActiveRouteConfig,
	useDetectValueChangesWorker,
	useNavigate,
	useRoutes,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { contentTypesConnector, useCoreTranslation } from '../../connectors';
import { BREADCRUMB_OPTIONS, CUSTOM_CC_DETAIL_TABS, MODULE_PATHS } from '../../customCC.const';
import { RouteProps, Tab } from '../../customCC.types';
import { useActiveField, useActiveTabs, useDynamicActiveField } from '../../hooks';

import { DEFAULT_PRESET_SEARCH_PARAMS } from './Update.const';

const UpdateView: FC<RouteProps> = ({ location, route, match }) => {
	const { presetUuid } = match.params;
	const showTabs = !/\/(aanmaken|bewerken)\//.test(location.pathname);

	/**
	 * Hooks
	 */

	const { tenantId } = useTenantContext();
	const { generatePath, navigate } = useNavigate();
	const [t] = useCoreTranslation();
	const initialPreset = useRef<PresetDetailModel | undefined>();
	const [initialLoading, setInitialLoading] = useState(true);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	const activeRouteConfig = useActiveRouteConfig(location, route);
	const activeTabs = useActiveTabs(CUSTOM_CC_DETAIL_TABS, location.pathname);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Content componenten', target: generatePath(MODULE_PATHS.overview) },
		],
	});

	const dynamicActiveField = useDynamicActiveField();
	const activeField = useActiveField();
	const [activePreset] = contentTypesConnector.hooks.usePreset(
		presetUuid,
		DEFAULT_PRESET_SEARCH_PARAMS
	);
	const [presetsLoading, presets] = contentTypesConnector.hooks.usePresets();
	const [, detailState] = contentTypesConnector.hooks.usePresetsUIStates(presetUuid);
	const [fieldTypesLoading, fieldTypes] = contentTypesConnector.hooks.useFieldTypes();
	const [fieldsHaveChanged, resetChangeDetection] = useDetectValueChangesWorker(
		!detailState?.isFetching,
		activePreset?.data?.fields,
		BFF_MODULE_PUBLIC_PATH
	);

	const pageTitle: ReactElement | undefined =
		typeof activeRouteConfig?.title === 'function'
			? activeRouteConfig.title(activePreset, activeField, dynamicActiveField, t)
			: '';

	const pageBadges: ContextHeaderBadge =
		typeof activeRouteConfig?.badges === 'function'
			? activeRouteConfig.badges(activeField, dynamicActiveField)
			: [];

	const pageTabs = showTabs ? activeTabs : [];

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

	// Set initial preset
	useEffect(() => {
		if (!initialPreset.current && activePreset) {
			initialPreset.current = activePreset;
		}
	}, [activePreset]);

	/**
	 * Methods
	 */

	const onCancel = (): void => {
		navigate(MODULE_PATHS.overview);
	};

	const onReset = (): void => {
		if (initialPreset.current) {
			contentTypesConnector.presetsFacade.updateDetail(presetUuid, initialPreset.current);
		}
	};

	const onSubmit = (data: PresetDetailModel, tab: Tab): void => {
		contentTypesConnector.presetsFacade
			.updatePreset(
				{
					uuid: data.uuid,
					body: {
						data: data.data,
					} as any,
				},
				{
					alertContainerId: tab.containerId,
				}
			)
			.finally(() => resetChangeDetection());
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
			onReset,
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
				linkProps={(props: ContextHeaderTabLinkProps) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.detail}/${props.href}`, {
						presetUuid,
					}),
					component: Link,
				})}
				tabs={pageTabs}
				badges={pageBadges}
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
