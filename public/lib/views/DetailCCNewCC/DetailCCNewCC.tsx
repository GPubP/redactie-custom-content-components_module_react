import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import {
	DataLoader,
	RenderChildRoutes,
	useNavigate,
	useQuery,
	useTenantContext,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { contentTypesConnector, CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { MODULE_PATHS } from '../../customCC.const';
import { DetailRouteProps, PresetField } from '../../customCC.types';
import { filterCompartments, generateFieldFromType } from '../../helpers';
import { useActiveField, useCompartments, useCompartmentValidation } from '../../hooks';
import { compartmentsFacade } from '../../store/compartments';
import { uiFacade } from '../../store/ui';

import { NEW_CC_COMPARTMENTS } from './DetailCCNewCC.const';

const DetailCCNewCCView: FC<DetailRouteProps> = ({ route, match }) => {
	const { presetUuid } = match.params;
	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const location = useLocation<{ keepActiveField: boolean }>();
	const queryParams = useQuery<{ fieldTypeUUID?: string; presetUUID?: string; name: string }>();
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const [preset, presetUI] = contentTypesConnector.hooks.useActivePreset(queryParams.presetUUID);
	const [initialLoading, setInitialLoading] = useState(true);
	const activeField = useActiveField();
	const [fieldType, fieldTypeUI] = contentTypesConnector.hooks.useActiveFieldType(
		queryParams.presetUUID ? preset?.data.fieldType.uuid : queryParams.fieldTypeUUID
	);
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = contentTypesConnector.hooks.useNavItemMatcher(preset, fieldType);
	const { generatePath, navigate } = useNavigate();
	const locationState = location.state ?? {
		keepActiveField: false,
	};
	const [
		{ compartments, active: activeCompartment },
		register,
		activate,
		setValid,
	] = useCompartments();
	const navListItems = useMemo(
		() =>
			compartments.map(c => ({
				activeClassName: 'is-active',
				label: c.label,
				hasError: hasSubmit && c.isValid === false,
				onClick: () => activate(c.name),
				to: {
					pathname: generatePath(`${c.slug || c.name}`, {
						presetUuid,
					}),
					search: location.search,
					state: { keepActiveField: !!locationState?.keepActiveField },
				},
			})),
		[
			activate,
			compartments,
			generatePath,
			hasSubmit,
			location.search,
			locationState,
			presetUuid,
		]
	);

	/**
	 * Trigger errors on form when switching from compartments
	 */
	useCompartmentValidation(activeCompartmentFormikRef, activeCompartment, hasSubmit);

	// Loading
	useEffect(() => {
		console.log(activeField);
		if (!fieldTypeUI?.isFetching && fieldType && !presetUI?.isFetching && !!activeField) {
			return setInitialLoading(false);
		}
	}, [fieldTypeUI, presetUI, activeField, fieldType]);

	// Set compartments
	useEffect(() => {
		if (!fieldType) {
			return;
		}

		register(filterCompartments(NEW_CC_COMPARTMENTS, navItemMatcher), { replace: true });

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [fieldType, navItemMatcher]); // eslint-disable-line

	// Create active field
	useEffect(() => {
		if (
			!locationState.keepActiveField &&
			((!fieldType && !preset) ||
				(fieldType && !preset && queryParams.fieldTypeUUID !== fieldType.uuid) ||
				(preset && queryParams.presetUUID !== preset.uuid))
		) {
			console.log(fieldType, preset, queryParams);
			uiFacade.clearActiveField();
		}

		// Keep the current active field when keepActiveField is set to true
		// This happens when the user navigates from the ContentTypesDynamicCCNew to the
		// ContentTypesCCNew view
		// We can not generate a new field because when we do, all changes on the current active
		// field will be lost
		if (fieldType?.data?.generalConfig && !locationState.keepActiveField) {
			const initialValues = {
				label: queryParams.name || fieldType.data.generalConfig.defaultLabel || '',
				name: kebabCase(queryParams.name || ''),
				generalConfig: { guideline: fieldType.data.generalConfig.defaultGuideline || '' },
			};
			console.log('set active field');

			uiFacade.setActiveField(
				generateFieldFromType(fieldType, initialValues, preset || undefined)
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fieldType, locationState.keepActiveField, preset, queryParams.name]);

	/**
	 * Methods
	 */
	const navigateToDetailCC = (): void => {
		navigate(MODULE_PATHS.detailCC, { presetUuid });
	};

	const onCCSubmit = (): void => {
		// test
		setHasSubmit(true);
	};

	const onCCChange = (data: PresetField): void => {
		compartmentsFacade.validate(data, {
			fieldType,
			preset,
		});
		uiFacade.updateActiveField(data);
	};

	/**
	 * Render
	 */

	if (!(queryParams.fieldTypeUUID || queryParams.presetUUID) || !queryParams.name) {
		navigateToDetailCC();
	}

	const renderChildRoutes = (): ReactElement | null => {
		console.log(initialLoading);
		const extraOptions = {
			CTField: activeField,
			fieldType: activeField?.fieldType,
			preset: preset,
			onSubmit: onCCChange,
			formikRef: (instance: FormikProps<FormikValues>) => {
				if (!equals(activeCompartmentFormikRef.current, instance)) {
					activeCompartmentFormikRef.current = instance;
				}
			},
		};

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	const renderCCNew = (): ReactElement | null => (
		<>
			<div className="u-margin-bottom-lg">
				<div className="row between-xs top-xs">
					<div className="col-xs-12 col-md-3 u-margin-bottom">
						<NavList items={navListItems} linkComponent={NavLink} />
					</div>

					<div className="col-xs-12 col-md-9">
						<Card>
							<CardBody>{renderChildRoutes()}</CardBody>
						</Card>
					</div>
				</div>
			</div>
			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<Button onClick={navigateToDetailCC} negative>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
						</Button>
						<Button className="u-margin-left-xs" onClick={onCCSubmit} type="success">
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
			{/* <LeavePrompt
				allowedPaths={CC_NEW_ALLOWED_PATHS}
				onConfirm={onCTSubmit}
				shouldBlockNavigationOnConfirm
				when={hasChanges}
			/> */}
		</>
	);

	return <DataLoader loadingState={initialLoading} render={renderCCNew} />;
};

export default DetailCCNewCCView;
