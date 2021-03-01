import { Button, ButtonGroup } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import { isNil } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';

import { StatusIcon } from '../../components';
import { CORE_TRANSLATIONS } from '../../connectors';
import { MODULE_PATHS, TENANT_ROOT } from '../../customCC.const';

import { DetailCCRowData } from './DetailCC.types';

export const DETAIL_CC_COLUMNS = (
	t: TranslateFunc,
	moveRow: (uuid: string, indexUpdate: number) => void = () => null
): TableColumn<DetailCCRowData>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		disableSorting: true,
		width: '35%',
		component(value: string, { canMoveDown, canMoveUp, id, name, path }) {
			return (
				<div className="u-flex u-flex-align-center u-flex-no-wrap">
					<ButtonGroup direction="vertical">
						<Button
							ariaLabel="Move item up"
							disabled={!canMoveUp}
							htmlType="button"
							icon="chevron-up"
							negative
							onClick={() => moveRow(id, -1)}
							size="tiny"
							transparent
						/>
						<Button
							ariaLabel="Move item down"
							disabled={!canMoveDown}
							htmlType="button"
							icon="chevron-down"
							negative
							onClick={() => moveRow(id, 1)}
							size="tiny"
							transparent
						/>
					</ButtonGroup>
					<div className="u-margin-left-xs u-min-w-0">
						{path ? (
							<Link to={path}>
								<EllipsisWithTooltip>{value}</EllipsisWithTooltip>
							</Link>
						) : (
							<p className="u-text-bold">
								<EllipsisWithTooltip>{value}</EllipsisWithTooltip>
							</p>
						)}
						{name && (
							<p className="u-text-light">
								<EllipsisWithTooltip>systeemnaam: [{name}]</EllipsisWithTooltip>
							</p>
						)}
					</div>
				</div>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_TYPE),
		value: 'fieldType',
		width: '15%',
		ellipsis: true,
		disableSorting: true,
	},
	{
		label: 'Meerdere',
		value: 'multiple',
		disableSorting: true,
		classList: ['u-text-center'],
		component(multiple: boolean) {
			return !isNil(multiple) ? <StatusIcon active={multiple ?? false} /> : null;
		},
		width: '10%',
	},
	{
		label: 'Verplicht',
		value: 'required',
		classList: ['u-text-center'],
		disableSorting: true,
		component(required: boolean) {
			return !isNil(required) ? <StatusIcon active={required ?? false} /> : null;
		},
		width: '10%',
	},
	{
		label: 'Vertaalbaar',
		value: 'translatable',
		disableSorting: true,
		classList: ['u-text-center'],
		width: '10%',
		component(translatable: boolean) {
			return !isNil(translatable) ? <StatusIcon active={translatable ?? false} /> : null;
		},
	},
	{
		label: 'Verborgen',
		value: 'hidden',
		disableSorting: true,
		classList: ['u-text-center'],
		width: '10%',
		component(hidden: boolean) {
			return !isNil(hidden) ? <StatusIcon active={hidden ?? false} /> : null;
		},
	},
	{
		label: '',
		disableSorting: true,
		classList: ['is-condensed', 'u-text-right'],
		width: '10%',
		component(value, { navigate }) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={navigate}
					type="primary"
					transparent
				/>
			);
		},
	},
];

export const DETAIL_CC_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.detailCCUpdateField}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewField}`,
	`${TENANT_ROOT}${MODULE_PATHS.detailCCNewFieldSettings}`,
];
