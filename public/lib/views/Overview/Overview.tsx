import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	DataLoader,
	OrderBy,
	parseObjToOrderBy,
	parseOrderByToObj,
	SearchParams,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { FilterForm, FilterFormState, FilterFormStatus, STATUS_OPTIONS } from '../../components';
import { contentTypesConnector, CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../customCC.const';
import { OverviewFilterItem } from '../../customCC.types';

import { OVERVIEW_COLUMNS, OVERVIEW_QUERY_PARAMS_CONFIG } from './Overview.const';
import { OverviewTableRow } from './Overview.types';

const OverviewView: FC = () => {
	/**
	 * Hooks
	 */
	const [query, setQuery] = useAPIQueryParams(OVERVIEW_QUERY_PARAMS_CONFIG);

	const [initialLoading, setInitialLoading] = useState(true);

	const [t] = useCoreTranslation();
	const { generatePath, navigate } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath)
	);
	const { loading, pagination } = contentTypesConnector.hooks.usePaginatedPresets(
		query as SearchParams,
		true
	);
	const presetListPaginator = contentTypesConnector.presetsFacade.listPaginator;

	// Set initial loading
	useEffect(() => {
		if (initialLoading && !loading) {
			setInitialLoading(false);
		}
	}, [initialLoading, loading]);

	// Clear presets cache
	useEffect(() => {
		presetListPaginator.clearCache();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Methods
	 */

	const createFilters = ({ name, status }: FilterFormState): OverviewFilterItem[] => {
		return [
			...(name
				? [
						{
							filterKey: 'search',
							valuePrefix: 'Zoekterm',
							value: name,
						},
				  ]
				: []),
			...(status
				? [
						{
							filterKey: 'active',
							valuePrefix: 'Status',
							value:
								STATUS_OPTIONS(t).find(option => option.value === status)?.label ||
								'',
						},
				  ]
				: []),
		];
	};

	const clearAllFilters = (): void => {
		setQuery({ page: 1, search: undefined, active: undefined });
	};

	const clearFilter = (item: OverviewFilterItem): void => {
		setQuery({ page: 1, [item.filterKey]: undefined });
	};

	const onPageChange = (page: number): void => {
		setQuery({ page });
	};

	const onOrderBy = ({ key, order }: OrderBy): void => {
		setQuery(parseOrderByToObj({ order, key: `data.${key}` }));
	};

	const onApplyFilters = (values: FilterFormState): void => {
		setQuery({
			page: 1,
			search: values.name || undefined,
			active: values.status ? values.status === FilterFormStatus.Active : undefined,
		});
	};

	const filterFormState: FilterFormState = {
		name: query.search ?? '',
		status:
			typeof query.active === 'boolean'
				? query.active
					? FilterFormStatus.Active
					: FilterFormStatus.NonActive
				: '',
	};
	const activeSorting = parseObjToOrderBy({
		sort: query.sort ? query.sort.split('.')[1] : '',
		direction: query.direction ?? 1,
	});
	const activeFilters = createFilters(filterFormState);

	/**
	 * Render
	 */

	const renderOverview = (): ReactElement | null => {
		const customCCRows: OverviewTableRow[] = (pagination?.data || []).map(preset => ({
			uuid: preset.uuid,
			label: preset.data.label,
			name: preset.data.name,
			description: preset.data.description,
			active: preset.meta.active,
			navigate,
		}));

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						initialState={filterFormState}
						onCancel={clearAllFilters}
						onSubmit={onApplyFilters}
						clearActiveFilter={clearFilter}
						activeFilters={activeFilters}
					/>
				</div>
				<PaginatedTable
					fixed
					className="u-margin-top"
					tableClassName="a-table--fixed--xs"
					columns={OVERVIEW_COLUMNS(t)}
					rows={customCCRows}
					currentPage={pagination?.currentPage || 1}
					itemsPerPage={query.pagesize}
					onPageChange={onPageChange}
					orderBy={onOrderBy}
					noDataMessage="Er zijn geen resultaten voor de ingestelde filters"
					loadDataMessage="Content componenten ophalen"
					activeSorting={activeSorting}
					totalValues={pagination?.total || 0}
					loading={loading}
				/>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Content componenten">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => navigate(MODULE_PATHS.create)}>
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default OverviewView;
