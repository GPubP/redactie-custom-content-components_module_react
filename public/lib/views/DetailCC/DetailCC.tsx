import { Button, Card } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection, Table } from '@acpaas-ui/react-editorial-components';
import { AlertContainer, LeavePrompt, useNavigate } from '@redactie/utils';
import { o, path, pathOr } from 'ramda';
import React, { FC, ReactElement, useMemo } from 'react';

import { AddCCForm, AddCCFormState } from '../../components';
import { contentTypesConnector, CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { ALERT_CONTAINER_IDS, CUSTOM_CC_DETAIL_TAB_MAP, MODULE_PATHS } from '../../customCC.const';
import { DetailRouteProps } from '../../customCC.types';
import { sortFieldTypes } from '../../helpers';

import { DETAIL_CC_ALLOWED_PATHS, DETAIL_CC_COLUMNS } from './DetailCC.const';
import { DetailCCRowData } from './DetailCC.types';

const DetailCCView: FC<DetailRouteProps> = ({
	fieldsHaveChanged,
	fieldTypes,
	match,
	preset,
	presets,
	onCancel,
	onSubmit,
}) => {
	const { presetUuid } = match.params;

	/**
	 * Hooks
	 */

	const { navigate, generatePath } = useNavigate();
	const [t] = useCoreTranslation();
	const [, detailState] = contentTypesConnector.hooks.usePresetsUIStates(presetUuid);
	const isLoading = useMemo(() => (!detailState ? true : (detailState.isUpdating as boolean)), [
		detailState,
	]);
	const fields = useMemo(() => {
		const filteredPresets = presets.filter(p => p.uuid !== presetUuid);
		return [...fieldTypes, ...filteredPresets].sort(sortFieldTypes).map(f => ({
			...f,
			isPreset: !!f.data?.fieldType,
		}));
	}, [fieldTypes, presetUuid, presets]);

	/**
	 * Variables
	 */

	const fieldTypeOptions = fields.map(fieldType => ({
		key: fieldType.uuid,
		value: fieldType.uuid,
		label: fieldType?.data?.label,
	}));

	/**
	 * Methods
	 */

	const onAddCCSubmit = ({ name, fieldType }: AddCCFormState): void => {
		const selectedCC = fields.find(f => f.uuid === fieldType);
		if (!selectedCC) {
			return;
		}

		const queryParams = new URLSearchParams(
			selectedCC.isPreset
				? {
						name,
						preset: selectedCC.uuid,
				  }
				: { name, fieldType: selectedCC.uuid }
		);

		navigate(`${MODULE_PATHS.detailCCNewFieldSettings}`, { presetUuid }, {}, queryParams);
	};

	const onCCSave = (): void => {
		onSubmit(preset, CUSTOM_CC_DETAIL_TAB_MAP.contentComponents);
	};

	/**
	 * Render
	 */

	const renderFieldsTable = (): ReactElement => {
		const contentTypeRows: DetailCCRowData[] = (preset.data.fields || []).map(cc => ({
			id: cc.field.uuid,
			path: generatePath(MODULE_PATHS.detailCCUpdateField, {
				presetUuid,
				contentComponentUuid: cc.field.uuid,
			}),
			label: cc.field.label,
			name: cc.field.name,
			fieldType:
				(path(['preset', 'data', 'label'])(cc.field) as string | null) ||
				pathOr('error', ['fieldType', 'data', 'label'])(cc.field),
			multiple: Number(cc.field.generalConfig.max) > 1,
			required: !!cc.field.generalConfig.required,
			translatable: !!cc.field.generalConfig.multiLanguage,
			hidden: !!cc.field.generalConfig.hidden,
			// canMoveUp: canMoveUp(cc),
			// canMoveDown: canMoveDown(cc),
			navigate: () =>
				navigate(MODULE_PATHS.detailCCUpdateField, {
					presetUuid,
					contentComponentUuid: cc.field.uuid,
				}),
		}));

		return (
			<Table
				dataKey="id"
				className="u-margin-top"
				columns={DETAIL_CC_COLUMNS(t)}
				rows={contentTypeRows}
				totalValues={preset.data.fields.length}
			/>
		);
	};

	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailCC}
			/>
			<div className="u-margin-bottom-lg">
				<h5>Content componenten</h5>

				{renderFieldsTable()}

				<div className="u-margin-top">
					<Card>
						<div className="u-margin">
							<h5>Voeg een content componenten toe</h5>
							<AddCCForm
								className="u-margin-top"
								fieldTypeOptions={fieldTypeOptions}
								formState={{
									fieldType: '',
									name: '',
								}}
								onSubmit={onAddCCSubmit}
								presets={presets}
							/>
						</div>
					</Card>
				</div>
			</div>

			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<Button onClick={onCancel} negative>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
						</Button>
						<Button
							iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
							disabled={isLoading || !fieldsHaveChanged}
							className="u-margin-left-xs"
							onClick={onCCSave}
							type="success"
						>
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>

			<LeavePrompt
				allowedPaths={DETAIL_CC_ALLOWED_PATHS}
				shouldBlockNavigationOnConfirm
				when={fieldsHaveChanged}
				onConfirm={onCCSave}
			/>
		</>
	);
};

export default DetailCCView;
