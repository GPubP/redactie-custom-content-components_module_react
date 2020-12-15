import { CompartmentModel } from '../store/compartments';

export function filterCompartments(
	compartments: CompartmentModel[],
	meta: any
): CompartmentModel[] {
	return compartments.reduce<CompartmentModel[]>((acc, { filter, ...rest }) => {
		if (filter && !filter(meta)) {
			return acc;
		}

		return acc.concat([rest]);
	}, []);
}
