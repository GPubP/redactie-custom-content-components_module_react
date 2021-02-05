import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip, Status } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { APIQueryParamsConfig } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { FilterFormState } from '../../components';
import { CORE_TRANSLATIONS } from '../../connectors';
import { MODULE_PATHS } from '../../customCC.const';
import { TableColumn } from '../../customCC.types';

import { OverviewTableRow } from './Overview.types';

export const DEFAULT_OVERVIEW_QUERY_PARAMS: APIQueryParamsConfig = {
	page: {
		defaultValue: 1,
		type: 'number',
	},
	pagesize: {
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
	default: {
		defaultValue: false,
		type: 'boolean',
	},
};

export const DEFAULT_FILTER_FORM: FilterFormState = {
	name: '',
	status: '',
};

export const OVERVIEW_COLUMNS = (t: TranslateFunc): TableColumn<OverviewTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		width: '60%',
		component(label: string, { description, name, uuid }: OverviewTableRow) {
			return (
				<>
					<AUILink to={`${uuid}/instellingen`} component={Link}>
						<EllipsisWithTooltip>{label}</EllipsisWithTooltip>
					</AUILink>
					<p className="small">
						[{name}]{' '}
						{description ? (
							<EllipsisWithTooltip>{description}</EllipsisWithTooltip>
						) : (
							<span className="u-text-italic">
								{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
							</span>
						)}
					</p>
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'active',
		width: '20%',
		component(active: boolean) {
			const activeLabel = active
				? t(CORE_TRANSLATIONS.STATUS_ACTIVE)
				: t(CORE_TRANSLATIONS['STATUS_NON-ACTIVE']);
			return <Status label={activeLabel} type={active ? 'ACTIVE' : 'INACTIVE'} />;
		},
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		width: '20%',
		component(value: unknown, { navigate, uuid }: OverviewTableRow) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => navigate(MODULE_PATHS.detailCC, { presetUuid: uuid })}
					transparent
				/>
			);
		},
	},
];
