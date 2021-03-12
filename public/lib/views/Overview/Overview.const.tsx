import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip, Status } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS } from '../../connectors';
import { MODULE_PATHS } from '../../customCC.const';

import { OverviewTableRow } from './Overview.types';

export const OVERVIEW_QUERY_PARAMS_CONFIG = {
	search: {
		type: 'string',
	},
	active: {
		type: 'boolean',
	},
	default: {
		defaultValue: false,
		type: 'boolean',
	},
	sparse: {
		defaultValue: true,
		type: 'boolean',
	},
} as const;

export const OVERVIEW_COLUMNS = (t: TranslateFunc): TableColumn<OverviewTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		width: '60%',
		component(label: string, { description, name, uuid }) {
			return (
				<>
					<AUILink to={`${uuid}/instellingen`} component={Link}>
						<EllipsisWithTooltip>{label}</EllipsisWithTooltip>
					</AUILink>
					<p className="small">
						{description ? (
							<EllipsisWithTooltip>
								[{name}] {description}
							</EllipsisWithTooltip>
						) : (
							<EllipsisWithTooltip>
								[{name}]{' '}
								<span className="u-text-italic">
									{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
								</span>
							</EllipsisWithTooltip>
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
		component(value, { navigate, uuid }) {
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
