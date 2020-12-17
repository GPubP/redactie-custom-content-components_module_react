import { Button, Card, CardBody } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, NavList } from '@acpaas-ui/react-editorial-components';
import {
	PresetDetailFieldModel,
	PresetDetailModel,
	PresetListModel,
} from '@redactie/content-types-module';
import {
	AlertContainer,
	alertService,
	DataLoader,
	LeavePrompt,
	RenderChildRoutes,
	useDetectValueChangesWorker,
	useNavigate,
	useTenantContext,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { equals, isEmpty, omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { contentTypesConnector, CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../customCC.const';
import { DetailRouteProps } from '../../customCC.types';
import { filterCompartments } from '../../helpers';
import {
	useActiveField,
	useCompartments,
	useCompartmentValidation,
	useDynamicActiveField,
	useDynamicField,
} from '../../hooks';
import { compartmentsFacade } from '../../store/compartments';
import { dynamicFieldFacade } from '../../store/dynamicField';
import { uiFacade } from '../../store/ui';

import {
	UPDATE_DYNAMIC_FIELD_ALLOWED_PATHS,
	UPDATE_DYNAMIC_FIELD_COMPARTMENTS,
} from './DetailCCUpdateDynamicField.const';

const DetailCCUpdateDynamicFieldView: FC<DetailRouteProps> = ({
	match,
	route,
	preset: activePreset,
}) => {
	const { presetUuid, contentComponentUuid, dynamicContentComponentUuid } = match.params;

	/**
	 * Hooks
	 */
	const [hasSubmit, setHasSubmit] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const activeCompartmentFormikRef = useRef<FormikProps<FormikValues>>();
	const activeField = useActiveField();
	const dynamicField = useDynamicField();
	const dynamicActiveField = useDynamicActiveField();
	const { generatePath, navigate } = useNavigate();
	const { tenantId } = useTenantContext();
	const [t] = useCoreTranslation();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const navItemMatcher = contentTypesConnector.hooks.useNavItemMatcher(
		dynamicActiveField?.preset as PresetDetailModel,
		dynamicActiveField?.fieldType
	);
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
		to: generatePath(c.slug || c.name, {
			presetUuid,
			contentComponentUuid,
			dynamicContentComponentUuid,
		}),
	}));
	console.log(dynamicField);

	/**
	 * Trigger errors on form when switching from compartments
	 */
	useCompartmentValidation(activeCompartmentFormikRef, activeCompartment, hasSubmit);

	/**
	 * Loading
	 */
	useEffect(() => {
		if (activeField) {
			return setInitialLoading(false);
		}

		setInitialLoading(true);
	}, [activeField]);

	/**
	 * Set compartments
	 */
	useEffect(() => {
		if (!activeField) {
			return;
		}

		register(filterCompartments(UPDATE_DYNAMIC_FIELD_COMPARTMENTS, navItemMatcher), {
			replace: true,
		});

		return () => {
			compartmentsFacade.clearCompartments();
		};
	}, [activeField, navItemMatcher]); // eslint-disable-line

	/**
	 * Set active field
	 */
	useEffect(() => {
		if (
			!contentComponentUuid ||
			!Array.isArray(activePreset.data.fields) ||
			(activeField && activeField.uuid === contentComponentUuid)
		) {
			return;
		}

		const newActiveField = activePreset.data.fields.find(
			field => field.field.uuid === contentComponentUuid
		);

		if (newActiveField) {
			uiFacade.setActiveField(newActiveField.field);
		}
	}, [activeField, activePreset.data.fields, contentComponentUuid]);

	/**
	 * Set dynamic active field
	 */
	useEffect(() => {
		if (
			!dynamicContentComponentUuid ||
			!Array.isArray(dynamicField?.config?.fields) ||
			dynamicActiveField?.uuid === dynamicContentComponentUuid ||
			!dynamicField
		) {
			return;
		}

		const field = (dynamicField?.config?.fields || []).find(
			f => f.uuid === dynamicContentComponentUuid
		);

		if (!field) {
			return;
		}

		dynamicFieldFacade.setActiveField(field);
	}, [dynamicContentComponentUuid, activeField, dynamicActiveField, dynamicField]);

	/**
	 * Methods
	 */
	const navigateToDetail = (): void => {
		navigate(
			activeField?.__new
				? MODULE_PATHS.detailCCNewFieldConfig
				: MODULE_PATHS.detailCCUpdateFieldConfig,
			{ presetUuid, contentComponentUuid },
			{
				// This will keep the current active field (paragraaf) in state when we redirect.
				// Changes made to the configuration of this field will not be overwritten
				keepActiveField: !!activeField?.__new,
			},
			new URLSearchParams(
				activeField?.__new
					? {
							fieldType: activeField.fieldType.uuid,
							name: activeField.label,
					  }
					: {}
			)
		);
	};

	const onFieldChange = (data: PresetDetailFieldModel): void => {
		compartmentsFacade.validate(data, {
			fieldType: dynamicActiveField?.fieldType,
			preset: (dynamicActiveField?.preset as unknown) as PresetListModel,
		});
		dynamicFieldFacade.updateActiveField({
			...data,
		});
	};

	const onFieldDelete = (): void => {
		if (!dynamicActiveField?.uuid) {
			return;
		}

		dynamicFieldFacade.deleteField(dynamicActiveField.uuid);
		dynamicFieldFacade.clearActiveField();
		navigateToDetail();
	};

	const onFieldSubmit = (): void => {
		if (!dynamicActiveField) {
			return;
		}

		const { current: formikRef } = activeCompartmentFormikRef;
		const compartmentsAreValid = compartmentsFacade.validate(dynamicActiveField, {
			fieldType: dynamicActiveField?.fieldType,
			preset: (dynamicActiveField?.preset as unknown) as PresetListModel,
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
			dynamicFieldFacade.updateField(omit(['__new'])(dynamicActiveField));
			navigateToDetail();
		} else {
			alertService.danger(
				{
					title: 'Er zijn nog fouten',
					message: '',
				},
				{ containerId: ALERT_CONTAINER_IDS.detailCCUpdateDynamicField }
			);
		}

		setHasSubmit(false);
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
			preset: dynamicActiveField?.preset,
			onDelete: onFieldDelete,
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

	const renderCCEdit = (): ReactElement | null => {
		return (
			<>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.detailCCUpdateDynamicField}
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
					allowedPaths={UPDATE_DYNAMIC_FIELD_ALLOWED_PATHS}
					onConfirm={onFieldSubmit}
					shouldBlockNavigationOnConfirm
					when={hasChanges}
				/>
			</>
		);
	};
	return <DataLoader loadingState={initialLoading} render={renderCCEdit} />;
};

export default DetailCCUpdateDynamicFieldView;
