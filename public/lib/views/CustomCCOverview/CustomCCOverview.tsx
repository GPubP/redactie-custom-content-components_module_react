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
	parseOrderByToString,
	parseStringToOrderBy,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';

import { FilterForm, FilterFormState } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { MODULE_PATHS } from '../../customCC.const';
import { FilterItem } from '../../customCC.types';
import { usePresetsPagination } from '../../hooks';

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
	const [activeFilters, setActiveFilters] = useState<FilterItem[]>([]);
	const [filterFormState, setFilterFormState] = useState<FilterFormState>(DEFAULT_FILTER_FORM);
	const [initialLoading, setInitialLoading] = useState(true);

	const [query, setQuery] = useAPIQueryParams(DEFAULT_OVERVIEW_QUERY_PARAMS, false);
	const [t] = useCoreTranslation();
	const { navigate } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[]);
	const { loading, pagination } = usePresetsPagination(query);

	const createFilters = useCallback((values: FilterFormState) => {
		return [
			{
				key: 'search',
				valuePrefix: 'Zoekterm',
				value: values.name,
			},
		].filter(f => !!f.value);
	}, []);

	// Set initial loading
	useEffect(() => {
		if (initialLoading && !loading) {
			setInitialLoading(false);
		}
	}, [initialLoading, loading]);

	// Set initial values with query params
	useEffect(() => {
		if (query.search) {
			const initialFilterState = { ...filterFormState, name: query.search };
			setFilterFormState(initialFilterState);
			setActiveFilters(createFilters(initialFilterState));
		}
		if (query.sort) {
			const { key, order } = parseStringToOrderBy(query.sort);
			setActiveSorting({ order, key: `data.${key}` });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Methods
	 */

	const clearAllFilters = (): void => {
		// Reset filters, query params and filter form
		setActiveFilters([]);
		setQuery({ search: '' });
		setFilterFormState(DEFAULT_FILTER_FORM);
	};

	const clearFilter = (item: FilterItem): void => {
		console.log(item);

		// Delete item from filters
		const updatedFilters = activeFilters.filter(el => el.value !== item.value);
		setActiveFilters(updatedFilters);
		// Update searchParams
		setQuery({ [item.key]: '' });
		setFilterFormState({
			...filterFormState,
			[item.key]: '',
		});
	};

	const onPageChange = (page: number): void => {
		setQuery({
			skip: (page - 1) * query.limit,
			page,
		});
	};

	const onOrderBy = (orderBy: OrderBy): void => {
		setQuery({ sort: parseOrderByToString(orderBy) });
		const { key, order } = parseStringToOrderBy(query.sort);
		setActiveSorting({ order, key: `data.${key}` });
	};

	const onApplyFilters = (values: FilterFormState): void => {
		// Update filters
		setFilterFormState(values);
		setActiveFilters(createFilters(values));
		// Update query
		setQuery({ search: values.name });
	};

	/**
	 * Render
	 */

	const renderOverview = (): ReactElement | null => {
		if (!pagination?.data.length) {
			return null;
		}

		const customCCRows: OverviewTableRow[] = pagination?.data.map(preset => ({
			uuid: preset.uuid,
			name: preset.data.label,
			description: `[${preset.data.name}]`,
			active: true,
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
					className="u-margin-top"
					columns={OVERVIEW_COLUMNS(t)}
					rows={customCCRows}
					currentPage={pagination?.currentPage || 1}
					itemsPerPage={query.limit}
					onPageChange={onPageChange}
					orderBy={onOrderBy}
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

export default CustomCCOverview;
