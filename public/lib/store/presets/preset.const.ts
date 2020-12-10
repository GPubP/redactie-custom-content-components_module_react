import { AlertProps } from '@redactie/utils';

import { PresetDetailModel } from './detail';

export type AlertMessages = Record<'create', { [key in 'success' | 'error']: AlertProps }>;

export const getAlertMessages = (preset: PresetDetailModel): AlertMessages => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `U hebt een nieuw content component ${preset.data.label} aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken van het content component ${preset.data.label} is mislukt`,
		},
	},
});
