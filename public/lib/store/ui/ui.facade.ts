import { PresetField } from '../../customCC.types';

import { uiQuery, UIQuery } from './ui.query';
import { uiStore, UIStore } from './ui.store';

export class UIFacade {
	constructor(protected store: UIStore, protected query: UIQuery) {}

	public readonly activeField$ = this.query.activeField$;

	/**
	 * Active Field actions
	 */

	public getActiveField(): PresetField | null {
		const { activeField } = this.store.getValue();

		return activeField || null;
	}

	public setActiveField(payload: PresetField): void {
		this.store.update({
			activeField: payload,
		});
	}

	public updateActiveField(payload: Partial<PresetField>): void {
		const { activeField } = this.store.getValue();

		if (!activeField) {
			return;
		}

		const payloadIsMultiple =
			(payload?.generalConfig?.max ?? (activeField?.generalConfig?.max || 0)) > 1;
		const activeFieldIsMultiple = (activeField?.generalConfig?.max || 0) > 1;

		// clear default value when switching form single to multiple or the other way around
		const clearDefaultValue = payloadIsMultiple !== activeFieldIsMultiple;

		this.store.update({
			activeField: {
				...activeField,
				...payload,
				generalConfig: {
					...activeField.generalConfig,
					...payload.generalConfig,
				},
				config: {
					...activeField.config,
					...payload.config,
				},
				validation: {
					...activeField.validation,
					...payload.validation,
					checks: payload.validation?.checks || activeField.validation?.checks || [],
				},
				defaultValue: clearDefaultValue
					? undefined
					: payload.defaultValue !== undefined
					? payload.defaultValue
					: activeField.defaultValue,
			} as PresetField,
		});
	}

	public clearActiveField(): void {
		this.store.update({
			activeField: undefined,
		});
	}
}

export const uiFacade = new UIFacade(uiStore, uiQuery);
