import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	Link,
} from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { PresetDetailModel } from '@redactie/content-types-module';
import {
	AlertContainer,
	alertService,
	LeavePrompt,
	useDetectValueChangesWorker,
	useNavigate,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import React, { FC, ReactElement, useMemo, useRef, useState } from 'react';

import { CustomCCSettingsForm, PresetStatus } from '../../components';
import { contentTypesConnector, CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { ALERT_CONTAINER_IDS, CUSTOM_CC_DETAIL_TAB_MAP, MODULE_PATHS } from '../../customCC.const';
import { DetailRouteProps } from '../../customCC.types';

const DetailSettingsView: FC<DetailRouteProps> = ({
	allowedPaths,
	onCancel,
	onSubmit,
	preset,
	match,
}) => {
	const { presetUuid } = match.params;
	const isUpdate = !!preset.uuid;

	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();
	const { generatePath } = useNavigate();
	const [listState, detailState] = contentTypesConnector.hooks.usePresetsUIStates(presetUuid);

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

		onSubmit(
			{
				...preset,
				data: {
					...preset.data,
					...value.data,
				},
			},
			CUSTOM_CC_DETAIL_TAB_MAP.settings
		);
		resetChangeDetection();
	};

	const onActiveToggle = (): void => {
		preset.meta.active
			? contentTypesConnector.presetsFacade.deactivatePreset(presetUuid)
			: contentTypesConnector.presetsFacade.activatePreset(presetUuid);
	};

	const getLoadingStateBtnProps = (
		loading: boolean
	): { iconLeft: string; disabled: boolean } | null => {
		return loading
			? {
					iconLeft: 'circle-o-notch fa-spin',
					disabled: true,
			  }
			: null;
	};

	const renderStatusCard = (): ReactElement => {
		const occurrences = ((preset.meta as any).occurrences as any[]) || [];
		const occurrencesCount = occurrences.length;
		const isActive = !!preset.meta.active;
		const text = `Deze content component wordt gebruikt in ${occurrencesCount} content types`;

		const statusText = preset.meta.active
			? occurrencesCount > 0
				? `${text} en kan daarom niet gedeactiveerd worden.`
				: `${text}. Deactiveer deze component indien je hem tijdelijk niet meer wil kunnen toevoegen aan nieuwe content types.`
			: `${text}. Activeer deze component indien je hem wil kunnen toevoegen aan niewe content types.`;

		return (
			<Card>
				<CardBody>
					<CardTitle>
						Status: <PresetStatus active={isActive} />
					</CardTitle>
					<CardDescription>
						{statusText}
						{occurrencesCount > 0 && (
							<ul>
								{occurrences.map((occurrence, index) => (
									<li key={`${index}_${occurrence.uuid}`}>
										<Link
											to={generatePath(
												`${MODULE_PATHS.contentTypes}/${occurrence.uuid}/content-componenten`
											)}
											component={Link}
										>
											{occurrence.name}
										</Link>
									</li>
								))}
							</ul>
						)}
					</CardDescription>
					{isActive && occurrencesCount === 0 && (
						<Button
							{...getLoadingStateBtnProps(!!detailState?.isActivating)}
							onClick={onActiveToggle}
							className="u-margin-top u-margin-right"
							type="primary"
						>
							{t('BUTTON_DEACTIVATE')}
						</Button>
					)}
					{!isActive && (
						<Button
							{...getLoadingStateBtnProps(!!detailState?.isActivating)}
							onClick={onActiveToggle}
							className="u-margin-top u-margin-right"
							type="primary"
						>
							{t('BUTTON_ACTIVATE')}
						</Button>
					)}
				</CardBody>
			</Card>
		);
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
							<div className="u-margin-top">{renderStatusCard()}</div>
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
