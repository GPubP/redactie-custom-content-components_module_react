import { PresetDetailModel } from '@redactie/content-types-module';
import { FormikProps, FormikValues } from 'formik';
import { ReactNode, Ref } from 'react';

import { FormikChildrenFn } from '../../../customCC.types';
export interface CustomCCSetingsFormProps {
	children?: FormikChildrenFn<PresetDetailModel> | ReactNode;
	disabled?: boolean;
	formikRef?: Ref<FormikProps<FormikValues>>;
	isUpdate?: boolean;
	preset: PresetDetailModel;
	onChange: (values: PresetDetailModel | null) => void;
	onSubmit: (values: PresetDetailModel | null) => void;
}
