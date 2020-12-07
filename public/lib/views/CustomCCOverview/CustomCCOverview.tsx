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
	LoadingState,
	OrderBy,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useState } from 'react';

import { FilterForm, FilterFormState } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { MODULE_PATHS } from '../../customCC.const';

import {
	DEFAULT_FILTER_FORM,
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	OVERVIEW_COLUMNS,
} from './CustomCCOverview.const';
import { OverviewTableRow } from './CustomCCOverview.types';

const CustomCCOverview: FC = () => {
	/**
	 * Hooks
	 */

	const [activeSorting, setActiveSorting] = useState<OrderBy>();
	const [activeFilters, setActiveFilters] = useState<any[]>([]);
	const [filterFormState, setFilterFormState] = useState<FilterFormState>(DEFAULT_FILTER_FORM);

	const [query, setQuery] = useAPIQueryParams(DEFAULT_OVERVIEW_QUERY_PARAMS);
	const [t] = useCoreTranslation();
	const { navigate } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[]);

	// TODO: replace by correct hooks
	const loadingContentTypes = 'loaded' as LoadingState;
	const meta = { skip: 0, total: 0 };

	/**
	 * Methods
	 */

	const clearAllFilters = (): void => {
		// Reset filters, query params and filter form
		setActiveFilters([]);
		setQuery(DEFAULT_OVERVIEW_QUERY_PARAMS);
		setFilterFormState(DEFAULT_FILTER_FORM);
	};

	const clearFilter = (item: any): void => {
		// Delete item from filters
		const updatedFilters = activeFilters.filter(el => el.value !== item.value);
		setActiveFilters(updatedFilters);
		// Update searchParams
		setQuery(DEFAULT_OVERVIEW_QUERY_PARAMS);
		setFilterFormState({
			...filterFormState,
			[item.filterKey]: '',
		});
	};

	const onPageChange = (page: number): void => {
		setQuery({ skip: (page - 1) * query.limit });
	};

	const onOrderBy = (orderBy: OrderBy): void => {
		setQuery({
			sort: `meta.${orderBy.key}`,
			direction: orderBy.order === 'desc' ? 1 : -1,
		});
		setActiveSorting(orderBy);
	};

	const onSubmit = (): void => {
		// TODO: handle submit
	};

	/**
	 * Render
	 */

	const renderOverview = (): ReactElement | null => {
		const customCCRows: OverviewTableRow[] = [].map(() => ({
			name: '',
			description: '',
			status: false,
			onEdit: () => navigate(''),
		}));

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						initialState={DEFAULT_FILTER_FORM}
						onCancel={clearAllFilters}
						onSubmit={onSubmit}
						clearActiveFilter={clearFilter}
						activeFilters={activeFilters}
					/>
				</div>
				<PaginatedTable
					className="u-margin-top"
					columns={OVERVIEW_COLUMNS(t)}
					rows={customCCRows}
					currentPage={Math.ceil(meta.skip / query.limit) + 1}
					itemsPerPage={query.limit}
					onPageChange={onPageChange}
					orderBy={onOrderBy}
					activeSorting={activeSorting}
					totalValues={meta.total || 0}
					loading={loadingContentTypes === LoadingState.Loading}
				/>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Content types">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => navigate(MODULE_PATHS.create)}>
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={false} render={renderOverview} />
			</Container>
		</>
	);
};

export default CustomCCOverview;
