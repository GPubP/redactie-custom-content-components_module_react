import { PresetDetailModel } from '@redactie/content-types-module';
import { FormikChildrenFn } from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { ReactNode, Ref } from 'react';

export interface CustomCCSetingsFormProps {
	children?: FormikChildrenFn<PresetDetailModel> | ReactNode;
	disabled?: boolean;
	formikRef?: Ref<FormikProps<FormikValues>>;
	isUpdate?: boolean;
	preset: PresetDetailModel;
	onChange: (values: PresetDetailModel | null) => void;
	onSubmit: (values: PresetDetailModel | null) => void;
}
