import { Breadcrumb } from '@redactie/redactie-core';
import { useNavigate } from '@redactie/utils';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { MODULE_PATHS } from '../../../customCC.const';
import { useDynamicField } from '../../../hooks';

const DynamicFieldBreadCrumb: FC<Breadcrumb> = ({ match }) => {
	const dynamicField = useDynamicField();
	const { generatePath } = useNavigate();

	return dynamicField?.label && match?.params?.contentComponentUuid ? (
		<>
			<Link to={generatePath(MODULE_PATHS.detailCCUpdateField, match?.params)}>
				{dynamicField.label}
			</Link>
		</>
	) : null;
};

export default DynamicFieldBreadCrumb;
