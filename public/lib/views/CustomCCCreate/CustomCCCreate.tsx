import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	DataLoader,
	RenderChildRoutes,
	useNavigate,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, ReactElement, useMemo } from 'react';
import { Link } from 'react-router-dom';

import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	CUSTOM_CC_DETAIL_TABS,
	MODULE_PATHS,
} from '../../customCC.const';
import { CustomCCRouteProps, TabsLinkProps } from '../../customCC.types';
import { useActiveTabs } from '../../hooks';
import { presetsFacade } from '../../store/presets';

import { CUSTOM_CC_SETTINGS_CREATE_ALLOWED_PATHS } from './CustomCCCreate.const';

const CustomCCCreate: FC<CustomCCRouteProps> = ({ location, route }) => {
	/**
	 * Hooks
	 */

	const { tenantId } = useTenantContext();

	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	const activeTabs = useActiveTabs(CUSTOM_CC_DETAIL_TABS.slice(0, 1), location.pathname);
	const { generatePath, navigate } = useNavigate();
	const breadcrumbs = useBreadcrumbs(route.routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Content componenten', target: generatePath(MODULE_PATHS.overview) },
		],
	});

	/**
	 * Methods
	 */

	const generateEmptyPreset = (): any => ({
		data: {
			name: '',
			label: '',
			fields: [],
			validators: [],
		},
	});

	const createPreset = (sectionData: any): void => {
		presetsFacade.createPreset({
			...generateEmptyPreset(),
			data: {
				...(sectionData as any),
			},
		} as any);
	};

	/**
	 * Render
	 */

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			allowedPaths: CUSTOM_CC_SETTINGS_CREATE_ALLOWED_PATHS,
			preset: generateEmptyPreset(),
			onCancel: () => navigate(MODULE_PATHS.overview),
			onSubmit: (sectionData: any) => createPreset(sectionData),
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
				tabs={activeTabs}
				linkProps={(props: TabsLinkProps) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.create}/${props.href}`),
					component: Link,
				})}
				title="Content component samenstellen"
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.create}
				/>
				<DataLoader loadingState={false} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default CustomCCCreate;
