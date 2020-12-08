import { PaginationResponse } from '@datorama/akita';
import { SearchParams, useObservable, usePrevious } from '@redactie/utils';
import { equals, omit } from 'ramda';
import { useEffect, useState } from 'react';
import { combineLatest, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { PresetListModel, presetsFacade } from '../../store/presets';

import { UsePresetsPagination } from './usePresetsPagination.types';

const paginator = presetsFacade.listPaginator;
const subject = new Subject<SearchParams>();
const searchParamsObservable = subject.asObservable();
let previousPage: number;

const usePresetsPagination: UsePresetsPagination = (searchParams, clearCache = false) => {
	const [pagination, setPagination] = useState<PaginationResponse<PresetListModel> | null>(null);
	const prevSearchParams = usePrevious<SearchParams>(searchParams);
	const loading = useObservable(presetsFacade.isFetching$, true);
	const error = useObservable(presetsFacade.listError$, null);

	useEffect(() => {
		const s = combineLatest([paginator.pageChanges, searchParamsObservable])
			.pipe(
				filter(([page, searchParams]) => {
					if (presetsFacade.getIsFetching()) {
						return false;
					}

					return page === searchParams.page;
				}),
				tap(([page]) => {
					presetsFacade.setIsFetching(true);
					previousPage = page;
				}),
				switchMap(([, searchParams]) =>
					paginator.getPage(() =>
						presetsFacade.getPresetsPaginated(omit(['page'], searchParams))
					)
				)
			)
			.subscribe(result => {
				if (result) {
					setPagination(result);
					presetsFacade.setIsFetching(false);
				}
			});

		return () => {
			s.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (equals(searchParams, prevSearchParams)) {
			return;
		}

		if (
			searchParams.sort !== prevSearchParams?.sort ||
			searchParams.search !== prevSearchParams?.search ||
			clearCache
		) {
			paginator.clearCache();
		}

		subject.next(searchParams);

		if (searchParams.page !== prevSearchParams?.page) {
			paginator.setPage(searchParams.page ?? 1);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		clearCache,
		prevSearchParams,
		searchParams,
		searchParams.page,
		searchParams.search,
		searchParams.sort,
	]);

	return {
		loading,
		pagination,
		refreshCurrentPage: paginator.refreshCurrentPage.bind(paginator),
		error,
	};
};

export default usePresetsPagination;
