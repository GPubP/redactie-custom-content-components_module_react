import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { APIQueryParamsConfig } from '@redactie/utils';
import React from 'react';

import { FilterFormState } from '../../components';
import { CORE_TRANSLATIONS } from '../../connectors';
import { TableColumn } from '../../customCC.types';

import { OverviewTableRow } from './CustomCCOverview.types';

export const DEFAULT_OVERVIEW_QUERY_PARAMS: APIQueryParamsConfig = {
	name: {
		defaultValue: '',
		type: 'string',
	},
	status: {
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
		component(name: string, rowData: OverviewTableRow) {
			return (
				<>
					{name}
					<p className="u-text-light u-margin-top-xs">{rowData.description}</p>
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'status',
		component(status: boolean, rowData: OverviewTableRow) {
			return null;
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'actions',
		component(value: any, rowData: OverviewTableRow) {
			return <Button onClick={rowData.onEdit} />;
		},
	},
];
