import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { APIQueryParamsConfig } from '@redactie/utils';
import React from 'react';

import { FilterFormState } from '../../components';
import { CORE_TRANSLATIONS } from '../../connectors';
import { MODULE_PATHS } from '../../customCC.const';
import { TableColumn } from '../../customCC.types';

import { OverviewTableRow } from './CustomCCOverview.types';

export const DEFAULT_OVERVIEW_QUERY_PARAMS: APIQueryParamsConfig = {
	page: {
		defaultValue: 1,
		type: 'number',
	},
	skip: {
		defaultValue: 0,
		type: 'number',
	},
	limit: {
		defaultValue: 10,
		type: 'number',
	},
	search: {
		defaultValue: '',
		type: 'string',
	},
	sort: {
		defaultValue: '',
		type: 'string',
	},
};

export const DEFAULT_FILTER_FORM: FilterFormState = {
	name: '',
	status: '',
};

export const OVERVIEW_COLUMNS = (t: TranslateFunc): TableColumn<OverviewTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'name',
		component(name: string, { description }: OverviewTableRow) {
			return (
				<>
					{name}
					{description && (
						<p>
							<small>{description}</small>
						</p>
					)}
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'active',
		component(active: boolean) {
			const activeClassName = active ? 'u-text-success' : 'u-text-danger';
			const activeLabel = active
				? t(CORE_TRANSLATIONS.STATUS_ACTIVE)
				: t(CORE_TRANSLATIONS['STATUS_NON-ACTIVE']);
			return <span className={activeClassName}>{activeLabel}</span>;
		},
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		component(value: unknown, { navigate, uuid }: OverviewTableRow) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => navigate(MODULE_PATHS.detail, { uuid })}
					transparent
				/>
			);
		},
	},
];
