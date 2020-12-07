export interface OverviewTableRow {
	name: string;
	description: string;
	status: boolean;
	onEdit: () => void;
}
