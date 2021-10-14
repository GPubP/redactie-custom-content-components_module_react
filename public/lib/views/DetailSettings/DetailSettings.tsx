import {
	Link as AUILink,
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
} from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { PresetDetailModel } from '@redactie/content-types-module';
import {
	AlertContainer,
	alertService,
	DeletePrompt,
	LeavePrompt,
	useDetectValueChangesWorker,
	useNavigate,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import React, { FC, ReactElement, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { CustomCCSettingsForm, PresetStatus } from '../../components';
import { contentTypesConnector, CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { ALERT_CONTAINER_IDS, CUSTOM_CC_DETAIL_TAB_MAP, MODULE_PATHS } from '../../customCC.const';
import { DetailRouteProps } from '../../customCC.types';

const DetailSettingsView: FC<DetailRouteProps> = ({
	allowedPaths,
	onCancel,
	onReset,
	onSubmit,
	onDelete,
	preset,
	match,
	create,
}) => {
	const { presetUuid } = match.params;
	const isUpdate = !!preset.uuid;

	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();
	const [listState, detailState] = contentTypesConnector.hooks.usePresetsUIStates(presetUuid);
	const { generatePath } = useNavigate();

	const formikRef = useRef<FormikProps<FormikValues>>();
	const isLoading = useMemo(
		() => (isUpdate ? !!detailState?.isUpdating : !!listState?.isCreating),
		[detailState, isUpdate, listState]
	);
	const [formValue, setFormValue] = useState<PresetDetailModel | null>(preset);
	const [hasChanges, resetChangeDetection] = useDetectValueChangesWorker(
		!isLoading,
		formValue,
		BFF_MODULE_PUBLIC_PATH
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

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

	const onDeletePromptConfirm = (): void => {
		if (onDelete) {
			onDelete(preset);
		}
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
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
		const occurrences = preset.meta?.occurrences || [];
		const occurrencesCount = occurrences.length;
		const isActive = !!preset.meta?.active;
		const pluralSingularText = occurrencesCount === 1 ? 'content type' : 'content types';
		const text = (
			<>
				Deze content component wordt gebruikt in{' '}
				<strong>
					{occurrencesCount} {pluralSingularText}
				</strong>
			</>
		);

		const statusText = preset.meta?.active ? (
			occurrencesCount > 0 ? (
				<p> {text} en kan daarom niet gedeactiveerd worden.</p>
			) : (
				<p>
					{text}. Deactiveer deze component indien je hem tijdelijk niet meer wil kunnen
					toevoegen aan nieuwe content types.
				</p>
			)
		) : (
			<p>
				{text}. Activeer deze component indien je hem wil kunnen toevoegen aan niewe content
				types.
			</p>
		);

		return (
			<Card>
				<CardBody>
					<CardTitle>
						Status: <PresetStatus active={isActive} />
					</CardTitle>
					<CardDescription>{statusText}</CardDescription>
					{occurrencesCount > 0 && (
						<ul>
							{occurrences.map((occurrence, index) => (
								<li key={`${index}_${occurrence.uuid}`}>
									<AUILink
										to={generatePath(
											`${MODULE_PATHS.contentTypes}/${occurrence.uuid}/content-componenten`,
											{ ctType: 'content-types' }
										)}
										component={Link}
									>
										{occurrence.name}
									</AUILink>
								</li>
							))}
						</ul>
					)}
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
					{occurrencesCount === 0 && (
						<Button
							onClick={() => setShowDeleteModal(true)}
							className="u-margin-top"
							type="danger"
							iconLeft="trash-o"
						>
							{t(CORE_TRANSLATIONS['BUTTON_REMOVE'])}
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
				onChange={setFormValue}
			>
				{({ submitForm }) => (
					<>
						{!create && <div className="u-margin-top">{renderStatusCard()}</div>}
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
							onDelete={onReset}
						/>
						<DeletePrompt
							body="Ben je zeker dat je deze custom content component wil verwijderen? Dit kan niet ongedaan gemaakt worden."
							isDeleting={isLoading}
							show={showDeleteModal}
							onCancel={onDeletePromptCancel}
							onConfirm={onDeletePromptConfirm}
						/>
					</>
				)}
			</CustomCCSettingsForm>
		</>
	);
};

export default DetailSettingsView;
