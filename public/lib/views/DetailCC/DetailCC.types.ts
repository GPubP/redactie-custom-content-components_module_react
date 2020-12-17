export interface DetailCCRowData {
	id: string;
	path: string;
	label: string;
	name: string;
	fieldType: string;
	multiple: boolean;
	required: boolean;
	translatable: boolean;
	hidden: boolean;
	canMoveUp: boolean;
	canMoveDown: boolean;
	navigate: () => void;
}
