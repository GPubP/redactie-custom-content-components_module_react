import { TranslateFunc } from '@redactie/translations-module';
import { object, string } from 'yup';

import { CORE_TRANSLATIONS } from '../../../connectors';
import { SelectOption } from '../../../customCC.types';

export const FILTER_FORM_VALIDATION_SCHEMA = object().shape({
	name: string(),
	status: string(),
});

export const STATUS_OPTIONS = (t: TranslateFunc): SelectOption[] => [
	{
		label: t(CORE_TRANSLATIONS.STATUS_ACTIVE),
		value: 'active',
	},
	{
		label: t(CORE_TRANSLATIONS['STATUS_NON-ACTIVE']),
		value: 'non-active',
	},
];
