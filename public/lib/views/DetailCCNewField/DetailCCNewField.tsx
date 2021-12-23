import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import { PresetDetailFieldModel } from '@redactie/content-types-module';
import {
	AlertContainer,
	alertService,
	DataLoader,
	LeavePrompt,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useQuery,
	useTenantContext,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { contentTypesConnector, CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../customCC.const';
import { DetailRouteProps } from '../../customCC.types';
import { filterCompartments, generateFieldFromType } from '../../helpers';
import {
	useActiveField,
	useCompartments,
	useCompartmentValidation,
	useDynamicField,
} from '../../hooks';
import { compartmentsFacade } from '../../store/compartments';
import { dynamicFieldFacade } from '../../store/dynamicField';
import { uiFacade } from '../../store/ui';

import { NEW_FIELD_ALLOWED_PATHS, NEW_FIELD_COMPARTMENTS } from './DetailCCNewField.const';

const DetailCCNewFieldView: FC<DetailRouteProps> = ({ route, match }) => {
	const { presetUuid } = match.params;
	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const location = useLocation<{ keepActiveField: boolean }>();
	const queryParams = useQuery<{ fieldType?: string; preset?: string; name: string }>();
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const dynamicField = useDynamicField();
	const [preset, presetUI] = contentTypesConnector.hooks.usePreset(queryParams.preset);
	const [initialLoading, setInitialLoading] = useState(true);
	const activeField = useActiveField();
	const [fieldType, fieldTypeUI] = contentTypesConnector.hooks.useFieldType(
		queryParams.preset ? preset?.data.fieldType.uuid : queryParams.fieldType
	);
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = contentTypesConnector.hooks.useNavItemMatcher(preset, fieldType);
	const { generatePath, navigate } = useNavigate();
	const locationState = location.state ?? {
		keepActiveField: false,
	};
	const keepActiveField = locationState.keepActiveField || false;
	const [hasChanges] = useDetectValueChangesWorker(
		!initialLoading,
		activeField,
		BFF_MODULE_PUBLIC_PATH
	);
	const [{ compartments, active: activeCompartment }, register, activate] = useCompartments();
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
		if (!fieldTypeUI?.isFetching && fieldType && !presetUI?.isFetching && !!activeField) {
			return setInitialLoading(false);
		}
	}, [fieldTypeUI, presetUI, activeField, fieldType]);

	// Set compartments
	useEffect(() => {
		if (!fieldType) {
			return;
		}

		register(filterCompartments(NEW_FIELD_COMPARTMENTS, navItemMatcher), { replace: true });

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [fieldType, navItemMatcher]); // eslint-disable-line

	// Create active field
	useEffect(() => {
		if (
			!keepActiveField &&
			((!fieldType && !preset) ||
				(fieldType && !preset && queryParams.fieldType !== fieldType.uuid) ||
				(preset && queryParams.preset !== preset.uuid))
		) {
			uiFacade.clearActiveField();
		}

		// Keep the current active field when keepActiveField is set to true
		// This happens when the user navigates from the ContentTypesDynamicCCNew to the
		// ContentTypesCCNew view
		// We can not generate a new field because when we do, all changes on the current active
		// field will be lost
		if (fieldType?.data?.generalConfig && !keepActiveField) {
			const initialValues = {
				label: queryParams.name || fieldType.data.generalConfig.defaultLabel || '',
				name: kebabCase(queryParams.name || ''),
				generalConfig: { guideline: fieldType.data.generalConfig.defaultGuideline || '' },
			};

			uiFacade.setActiveField(
				generateFieldFromType(fieldType, initialValues, preset || undefined)
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fieldType, keepActiveField, preset, queryParams.name]);

	/**
	 * Methods
	 */
	const navigateToDetailCC = (): void => {
		navigate(MODULE_PATHS.detailCC, { presetUuid });
	};

	const onFieldSubmit = (): void => {
		if (!activeField) {
			return;
		}

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = compartmentsFacade.validate(activeField, {
			fieldType,
			preset,
		});

		// Validate current form to trigger fields error states
		if (formikRef) {
			formikRef.validateForm().then(errors => {
				if (!isEmpty(errors)) {
					formikRef.setErrors(errors);
				}
			});
		}
		// Only submit the form if all compartments are valid
		if (compartmentsAreValid) {
			// add field to preset store
			contentTypesConnector.presetsFacade.addField(presetUuid, activeField);
			uiFacade.clearActiveField();
			navigateToDetailCC();
		} else {
			alertService.invalidForm({
				containerId: ALERT_CONTAINER_IDS.detailCCNewField,
			});
		}

		setHasSubmit(true);
	};

	const onFieldChange = (data: PresetDetailFieldModel): void => {
		compartmentsFacade.validate(data, {
			fieldType,
			preset,
		});
		uiFacade.updateActiveField(data);
	};

	/**
	 * Render
	 */

	if (!(queryParams.fieldType || queryParams.preset) || !queryParams.name) {
		navigateToDetailCC();
	}

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			CTField: activeField,
			fieldType: activeField?.fieldType,
			preset: preset,
			dynamicFieldSettingsContext: {
				dynamicField,
				getCreatePath: (isPreset: boolean, fieldTypeUuid: string) =>
					generatePath(
						MODULE_PATHS.detailCCNewDynamicFieldSettings,
						{
							presetUuid,
							contentComponentUuid: activeField?.uuid,
						},
						new URLSearchParams(
							isPreset ? { preset: fieldTypeUuid } : { fieldType: fieldTypeUuid }
						)
					),
				getEditPath: (uuid: string) =>
					generatePath(MODULE_PATHS.detailCCUpdateDynamicFieldSettings, {
						presetUuid,
						contentComponentUuid: activeField?.uuid,
						dynamicContentComponentUuid: uuid,
					}),
				setDynamicField: dynamicFieldFacade.setDynamicField.bind(dynamicFieldFacade),
			},
			onSubmit: onFieldChange,
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

	const renderCCNewField = (): ReactElement | null => (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailCCNewField}
			/>
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
						<Button className="u-margin-left-xs" onClick={onFieldSubmit} type="info">
							{t(CORE_TRANSLATIONS.BUTTON_NEXT)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>
			<LeavePrompt
				allowedPaths={NEW_FIELD_ALLOWED_PATHS}
				onConfirm={onFieldSubmit}
				shouldBlockNavigationOnConfirm
				when={hasChanges}
			/>
		</>
	);

	return <DataLoader loadingState={initialLoading} render={renderCCNewField} />;
};

export default DetailCCNewFieldView;
