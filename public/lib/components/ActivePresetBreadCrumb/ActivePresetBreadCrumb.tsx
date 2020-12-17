import { useObservable } from '@redactie/utils';
import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { contentTypesConnector } from '../../connectors';

const ActivePresetBreadCrumb: FC = () => {
	const { presetUuid } = useParams<{ presetUuid: string }>();

	const presetObservable = useMemo(
		() => contentTypesConnector.presetsFacade.selectPreset(presetUuid),
		[presetUuid]
	);
	const preset = useObservable(presetObservable);

	return preset?.data.label ? <>{preset.data.label}</> : null;
};

export default ActivePresetBreadCrumb;
