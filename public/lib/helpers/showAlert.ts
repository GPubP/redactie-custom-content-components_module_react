import { alertService } from '@redactie/utils';

const COMPARTMENT_ERROR_DEFAULTS = {
	title: 'Opgelet',
	message:
		'Er staan fouten in het formulier op deze pagina of je bent iets vergeten invullen. Gelieve de gemarkeerde velden na te kijken.',
};

export const showCompartmentErrorAlert = ({
	title = COMPARTMENT_ERROR_DEFAULTS.title,
	message = COMPARTMENT_ERROR_DEFAULTS.message,
	containerId,
}: {
	title?: string;
	message?: string;
	containerId: string;
}): void => {
	alertService.danger({ title, message }, { containerId });
};
