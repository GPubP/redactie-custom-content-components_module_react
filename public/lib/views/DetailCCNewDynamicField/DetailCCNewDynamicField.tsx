import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import { PresetDetailFieldModel } from '@redactie/content-types-module';
import {
	AlertContainer,
	DataLoader,
	LeavePrompt,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useQuery,
	useTenantContext,
	useWillUnmount,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import kebabCase from 'lodash.kebabcase';
import { equals, isEmpty, omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { contentTypesConnector, CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../customCC.const';
import { DetailRouteProps } from '../../customCC.types';
import { filterCompartments, generateFieldFromType } from '../../helpers';
import { showCompartmentErrorAlert } from '../../helpers/showAlert';
import {
	useActiveField,
	useCompartments,
	useCompartmentValidation,
	useDynamicActiveField,
	useDynamicField,
} from '../../hooks';
import { compartmentsFacade } from '../../store/compartments';
import { dynamicFieldFacade } from '../../store/dynamicField';

import {
	NEW_DYNAMIC_FIELD_ALLOWED_PATHS,
	NEW_DYNAMIC_FIELD_COMPARTMENTS,
} from './DetailCCNewDynamicField.const';

const DetailCCNewDynamicFieldView: FC<DetailRouteProps> = ({
	match,
	route,
	preset: activePreset,
}) => {
	const { presetUuid, contentComponentUuid } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const queryParams = useQuery<{ fieldType?: string; preset?: string }>();
	const [preset, presetUI] = contentTypesConnector.hooks.usePreset(queryParams.preset);
	const [fieldType, fieldTypeUI] = contentTypesConnector.hooks.useFieldType(
		preset ? preset?.data.fieldType.uuid : queryParams.fieldType
	);

	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const dynamicActiveField = useDynamicActiveField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = contentTypesConnector.hooks.useNavItemMatcher(preset, fieldType);
	const [hasChanges] = useDetectValueChangesWorker(
		!initialLoading,
		dynamicActiveField,
		BFF_MODULE_PUBLIC_PATH
	);
	const [{ compartments, active: activeCompartment }, register, activate] = useCompartments();
	const navListItems = compartments.map(c => ({
		activeClassName: 'is-active',
		label: c.label,
		hasError: hasSubmit && c.isValid === false,
		onClick: () => activate(c.name),
		to: generatePath(`${c.slug || c.name}${location.search}`, {
			presetUuid,
			contentComponentUuid,
		}),
	}));

	useWillUnmount(() => {
		dynamicFieldFacade.clearActiveField();
	});

	/**
	 * Trigger errors on form when switching from compartments
	 */
	useCompartmentValidation(activeCompartmentFormikRef, activeCompartment, hasSubmit);

	// Loading
	useEffect(() => {
		if (!fieldTypeUI?.isFetching && !presetUI?.isFetching && dynamicField) {
			return setInitialLoading(false);
		}

		setInitialLoading(true);
	}, [dynamicField, fieldTypeUI, presetUI]);

	// Set compartments
	useEffect(() => {
		if (!fieldType) {
			return;
		}

		register(filterCompartments(NEW_DYNAMIC_FIELD_COMPARTMENTS, navItemMatcher), {
			replace: true,
		});

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [fieldType, navItemMatcher]); // eslint-disable-line

	useEffect(() => {
		if (
			dynamicField || // Only set dynamic field if it hasn't been set yet (in case of reload)
			!contentComponentUuid || // Incufficient data => skip
			!Array.isArray(activePreset.data.fields) // Insufficient data => skip
		) {
			return;
		}

		if (activeField) {
			dynamicFieldFacade.setDynamicField(activeField);
		}

		const newActiveField = activePreset.data.fields.find(
			field => field.field.uuid === contentComponentUuid
		);

		if (newActiveField) {
			dynamicFieldFacade.setDynamicField(newActiveField.field);
		}
	}, [
		activeField,
		activePreset.data.fields,
		contentComponentUuid,
		dynamicField,
		fieldType,
		preset,
		presetUuid,
	]);

	/**
	 * Generate a new field based on the selected fieldtype and
	 * make it the active working field in the store
	 */
	useEffect(() => {
		if (
			(!fieldType && !preset) ||
			(fieldType && queryParams.fieldType !== fieldType.uuid) ||
			(preset && presetUuid !== preset.uuid)
		) {
			dynamicFieldFacade.clearActiveField();
		}

		if (fieldType) {
			const label =
				preset?.data.label ||
				fieldType.data.label ||
				fieldType.data.generalConfig.defaultLabel ||
				'';
			const initialValues = {
				label,
				name: kebabCase(label),
				generalConfig: {
					guideline: fieldType.data.generalConfig.defaultGuideline || '',
				},
			};
			dynamicFieldFacade.setActiveField(
				generateFieldFromType(fieldType, initialValues, preset || undefined)
			);
		}
	}, [fieldType, preset, presetUuid, queryParams.fieldType]);

	/**
	 * Methods
	 */
	const navigateToDetail = (): void => {
		navigate(
			activeField?.__new
				? MODULE_PATHS.detailCCNewFieldConfig
				: MODULE_PATHS.detailCCUpdateFieldConfig,
			{
				presetUuid,
				contentComponentUuid,
			},
			{
				// This will keep the current active field (paragraaf) in state when we redirect.
				// Changes made to the configuration of this field will not be overwritten
				keepActiveField: true,
			},
			new URLSearchParams(
				activeField?.__new
					? {
							fieldType: activeField?.fieldType.uuid,
							name: activeField.label,
					  }
					: {}
			)
		);
	};

	const onFieldSubmit = (): void => {
		if (!dynamicActiveField) {
			return;
		}

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = compartmentsFacade.validate(dynamicActiveField, {
			fieldType: dynamicActiveField?.fieldType,
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
			dynamicFieldFacade.addField(omit(['__new'])(dynamicActiveField));
			navigateToDetail();
		} else {
			showCompartmentErrorAlert({ containerId: ALERT_CONTAINER_IDS.detailCCNewDynamicField });
		}

		setHasSubmit(true);
	};

	const onFieldChange = (data: PresetDetailFieldModel): void => {
		compartmentsFacade.validate(data, {
			fieldType: dynamicActiveField?.fieldType,
			preset,
		});
		dynamicFieldFacade.updateActiveField(data);
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | void => {
		if (!dynamicActiveField) {
			return;
		}

		const extraOptions = {
			CTField: dynamicActiveField,
			fieldType: dynamicActiveField?.fieldType,
			preset: preset,
			onSubmit: onFieldChange,
			formikRef: (instance: any) => {
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

	const renderCCNewDynamicField = (): ReactElement | null => {
		return (
			<>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.detailCCNewDynamicField}
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
							<Button onClick={navigateToDetail} negative>
								{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
							</Button>
							<Button
								className="u-margin-left-xs"
								onClick={onFieldSubmit}
								type="primary"
							>
								{t(CORE_TRANSLATIONS.BUTTON_NEXT)}
							</Button>
						</div>
					</ActionBarContentSection>
				</ActionBar>
				<LeavePrompt
					allowedPaths={NEW_DYNAMIC_FIELD_ALLOWED_PATHS}
					onConfirm={onFieldSubmit}
					shouldBlockNavigationOnConfirm
					when={hasChanges}
				/>
			</>
		);
	};

	return <DataLoader loadingState={initialLoading} render={renderCCNewDynamicField} />;
};

export default DetailCCNewDynamicFieldView;
