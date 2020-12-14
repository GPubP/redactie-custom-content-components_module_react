import React, { FC } from 'react';

import { StatusIconProps } from './StatusIcon.types';

const StatusIcon: FC<StatusIconProps> = ({ active }) => {
	const activeClassName = active ? 'u-text-success fa fa-check' : 'u-text-danger fa fa-close';
	return <span className={activeClassName} />;
};

export default StatusIcon;
