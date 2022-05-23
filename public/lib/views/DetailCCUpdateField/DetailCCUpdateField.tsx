import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import { PresetDetailFieldModel } from '@redactie/content-types-module';
import {
	AlertContainer,
	alertService,
	DataLoader,
	DeletePrompt,
	LeavePrompt,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useTenantContext,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { equals, isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import {
	contentTypesConnector,
	CORE_TRANSLATIONS,
	languagesConnector,
	useCoreTranslation,
} from '../../connectors';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../customCC.const';
import { DetailRouteProps } from '../../customCC.types';
import { filterCompartments } from '../../helpers';
import {
	useActiveField,
	useCompartments,
	useCompartmentValidation,
	useDynamicField,
} from '../../hooks';
import { compartmentsFacade } from '../../store/compartments';
import { dynamicFieldFacade } from '../../store/dynamicField';
import { uiFacade } from '../../store/ui';

import { UPDATE_FIELD_ALLOWED_PATHS, UPDATE_FIELD_COMPARTMENTS } from './DetailCCUpdateField.const';

const DetailCCUpdateFieldView: FC<DetailRouteProps> = ({ match, preset: activePreset, route }) => {
	const { presetUuid, contentComponentUuid } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [invalidCCUuid, setInvalidCCUuid] = useState(false);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const activeFieldFTUuid = useMemo(() => activeField?.fieldType.uuid, [activeField]);
	const activeFieldPSUuid = useMemo(() => activeField?.preset?.uuid, [activeField]);
	const [fieldType, fieldTypeUI] = contentTypesConnector.hooks.useFieldType(activeFieldFTUuid);
	const [preset, presetUI] = contentTypesConnector.hooks.usePreset(activeFieldPSUuid);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = contentTypesConnector.hooks.useNavItemMatcher(preset, fieldType);
	const [hasChanges] = useDetectValueChangesWorker(
		!initialLoading,
		activeField,
		BFF_MODULE_PUBLIC_PATH
	);
	const [{ compartments, active: activeCompartment }, register, activate] = useCompartments();
	const [, languages] = languagesConnector.hooks.useActiveLanguages();
	const navListItems = compartments.map(c => ({
		activeClassName: 'is-active',
		label: c.label,
		hasError: hasSubmit && c.isValid === false,
		onClick: () => activate(c.name),
		to: generatePath(c.slug || c.name, { presetUuid, contentComponentUuid }),
	}));

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

		register(filterCompartments(UPDATE_FIELD_COMPARTMENTS, navItemMatcher), { replace: true });

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [fieldType, navItemMatcher]); // eslint-disable-line

	useEffect(() => {
		const presetFields = activePreset.data.fields;
		if (
			!contentComponentUuid ||
			!Array.isArray(presetFields) ||
			(activeField && activeField?.uuid === contentComponentUuid)
		) {
			return;
		}

		const newActiveField = presetFields.find(
			field => field.field.uuid === contentComponentUuid
		);

		if (newActiveField) {
			uiFacade.setActiveField(newActiveField.field);
		} else {
			setInvalidCCUuid(true);
		}
	}, [activeField, activeFieldFTUuid, activePreset.data.fields, contentComponentUuid]);

	/**
	 * Methods
	 */
	const navigateToDetailCC = (): void => {
		navigate(MODULE_PATHS.detailCC, { presetUuid });
	};

	const onFieldChange = (data: PresetDetailFieldModel): void => {
		compartmentsFacade.validate(data, {
			fieldType,
			preset,
			languages: languages || [],
		});
		uiFacade.updateActiveField(data);
	};

	const onFieldDelete = (): void => {
		setShowDeleteModal(true);
	};

	const onFieldSubmit = (): void => {
		if (!activeField) {
			return;
		}

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = compartmentsFacade.validate(activeField, {
			fieldType,
			preset,
			languages: languages || [],
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
			contentTypesConnector.presetsFacade.updateField(presetUuid, activeField);
			uiFacade.clearActiveField();
			navigateToDetailCC();
		} else {
			alertService.invalidForm({
				containerId: ALERT_CONTAINER_IDS.detailCCUpdateField,
			});
		}

		setHasSubmit(true);
	};

	const onDeletePromptConfirm = (): void => {
		if (activeField?.uuid) {
			contentTypesConnector.presetsFacade.deleteField(presetUuid, activeField.uuid);
			uiFacade.clearActiveField();
			navigateToDetailCC();
		}
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
	};

	/**
	 * Render
	 */

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			CTField: activeField,
			fieldType,
			preset,
			parentPreset: activePreset,
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
			onDelete: onFieldDelete,
			onSubmit: onFieldChange,
			formikRef: (instance: FormikProps<FormikValues>) => {
				if (!equals(activeCompartmentFormikRef.current, instance)) {
					activeCompartmentFormikRef.current = instance;
				}
			},
			activeLanguages: languages || [],
			hasSubmit,
		};

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	const renderCCUpdateField = (): ReactElement | null => {
		return (
			<>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.detailCCUpdateField}
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
							<Button
								className="u-margin-left-xs"
								onClick={onFieldSubmit}
								type="info"
								disabled={!hasChanges}
							>
								{t(CORE_TRANSLATIONS.BUTTON_NEXT)}
							</Button>
						</div>
					</ActionBarContentSection>
				</ActionBar>
				<LeavePrompt
					allowedPaths={UPDATE_FIELD_ALLOWED_PATHS}
					onConfirm={onFieldSubmit}
					shouldBlockNavigationOnConfirm
					when={hasChanges}
				/>
				<DeletePrompt
					show={showDeleteModal}
					onCancel={onDeletePromptCancel}
					onConfirm={onDeletePromptConfirm}
				/>
			</>
		);
	};

	return (
		<>
			{!invalidCCUuid ? (
				<DataLoader loadingState={initialLoading} render={renderCCUpdateField} />
			) : (
				<div>
					<p className="u-margin-top-xs u-margin-bottom">
						De content component kan niet worden geladen. Probeer later opnieuw.
					</p>
					<Button onClick={navigateToDetailCC} outline>
						{t(CORE_TRANSLATIONS['BUTTON_BACK-TO-OVERVIEW'])}
					</Button>
				</div>
			)}
		</>
	);
};

export default DetailCCUpdateFieldView;
