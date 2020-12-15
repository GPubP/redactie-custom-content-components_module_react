import { Button } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { PresetDetailModel } from '@redactie/content-types-module';
import {
	AlertContainer,
	alertService,
	LeavePrompt,
	useDetectValueChangesWorker,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import React, { FC, useMemo, useRef, useState } from 'react';

import { CustomCCSettingsForm } from '../../components';
import { contentTypesConnector, CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { ALERT_CONTAINER_IDS, CUSTOM_CC_DETAIL_TAB_MAP } from '../../customCC.const';
import { DetailRouteProps } from '../../customCC.types';

const DetailSettingsView: FC<DetailRouteProps> = ({ allowedPaths, onCancel, onSubmit, preset }) => {
	const isUpdate = !!preset.uuid;

	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();
	const [listState, detailState] = contentTypesConnector.hooks.usePresetsUIStates();

	const formikRef = useRef<FormikProps<FormikValues>>();
	const isLoading = useMemo(
		() => (isUpdate ? !!detailState?.isUpdating : !!listState?.isCreating),
		[detailState, isUpdate, listState]
	);
	const [formValue, setFormValue] = useState<PresetDetailModel | null>(null);
	const [hasChanges, resetChangeDetection] = useDetectValueChangesWorker(
		!isLoading,
		formValue,
		BFF_MODULE_PUBLIC_PATH
	);

	/**
	 * Methods
	 */
	const renderDangerAlert = ({
		title = 'Foutmelding',
		message = 'Niet alle velden van het formulier zijn correct ingevuld',
	} = {}): void => {
		alertService.danger(
			{ title, message },
			{ containerId: ALERT_CONTAINER_IDS.detailSettings }
		);
	};

	const onFormSubmit = async (value: PresetDetailModel | null): Promise<void> => {
		if (!value) {
			return renderDangerAlert();
		}

		if (!formikRef || !formikRef.current) {
			return renderDangerAlert({
				message: 'Er is iets fout gelopen. Probeer later opnieuw.',
			});
		}

		onSubmit({ ...preset.data, ...value.data }, CUSTOM_CC_DETAIL_TAB_MAP.settings);
		resetChangeDetection();
	};

	/**
	 * Render
	 */
	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailSettings}
			/>
			<CustomCCSettingsForm
				formikRef={instance => (formikRef.current = instance || undefined)}
				preset={preset}
				isUpdate={isUpdate}
				onSubmit={onFormSubmit}
			>
				{({ submitForm, values }) => {
					setFormValue(values);

					return (
						<>
							<ActionBar className="o-action-bar--fixed" isOpen>
								<ActionBarContentSection>
									<div className="u-wrapper u-text-right">
										<Button onClick={onCancel} negative>
											{isUpdate
												? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
												: t(CORE_TRANSLATIONS.BUTTON_BACK)}
										</Button>
										<Button
											iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
											disabled={isLoading || !hasChanges}
											className="u-margin-left-xs"
											onClick={submitForm}
											type="success"
										>
											{isUpdate
												? t(CORE_TRANSLATIONS.BUTTON_SAVE)
												: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
										</Button>
									</div>
								</ActionBarContentSection>
							</ActionBar>
							<LeavePrompt
								allowedPaths={allowedPaths}
								when={hasChanges}
								shouldBlockNavigationOnConfirm
								onConfirm={submitForm}
							/>
						</>
					);
				}}
			</CustomCCSettingsForm>
		</>
	);
};

export default DetailSettingsView;
