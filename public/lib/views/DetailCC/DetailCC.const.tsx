import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { isNil } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';

import { StatusIcon } from '../../components';
import { CORE_TRANSLATIONS } from '../../connectors';
import { MODULE_PATHS, TENANT_ROOT } from '../../customCC.const';
import { TableColumn } from '../../customCC.types';

import { DetailCCRowData } from './DetailCC.types';

export const DETAIL_CC_COLUMNS = (
	t: TranslateFunc,
	onExpand: (id: string) => void = () => null
	// moveRow: (uuid: string, action: MoveAction) => void = () => null
): TableColumn<DetailCCRowData>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		disableSorting: true,
		component(value: string, rowData: DetailCCRowData) {
			const { path } = rowData;
			return (
				<>
					{path ? <Link to={path}>{value}</Link> : <p className="u-text-bold">{value}</p>}
					{rowData.name && <p className="u-text-light">systeemnaam: [{rowData.name}]</p>}
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_TYPE),
		value: 'fieldType',
		disableSorting: true,
	},
	{
		label: 'Meerdere',
		value: 'multiple',
		disableSorting: true,
		classList: ['u-text-center'],
		component(value: any, rowData: DetailCCRowData) {
			return !isNil(rowData.multiple) ? (
				<StatusIcon active={rowData.multiple ?? false} />
			) : null;
		},
	},
	{
		label: 'Verplicht',
		value: 'required',
		classList: ['u-text-center'],
		disableSorting: true,
		component(value: any, rowData: DetailCCRowData) {
			return !isNil(rowData.required) ? (
				<StatusIcon active={rowData.required ?? false} />
			) : null;
		},
	},
	{
		label: 'Vertaalbaar',
		value: 'translatable',
		disableSorting: true,
		classList: ['u-text-center'],
		component(value: any, rowData: DetailCCRowData) {
			return !isNil(rowData.translatable) ? (
				<StatusIcon active={rowData.translatable ?? false} />
			) : null;
		},
	},
	{
		label: 'Verborgen',
		value: 'hidden',
		disableSorting: true,
		classList: ['u-text-center'],
		component(value: any, rowData: DetailCCRowData) {
			return !isNil(rowData.hidden) ? <StatusIcon active={rowData.hidden ?? false} /> : null;
		},
	},
	{
		label: '',
		disableSorting: true,
		classList: ['is-condensed'],
		component(value: any, rowData: DetailCCRowData) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() =>
						rowData.navigate && typeof rowData.navigate === 'function'
							? rowData.navigate()
							: onExpand(rowData.id)
					}
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
