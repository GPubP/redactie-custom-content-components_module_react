import { FormikProps, FormikValues, setNestedObjectValues } from 'formik';
import { isEmpty } from 'ramda';
import { MutableRefObject, useEffect } from 'react';

import { CompartmentModel } from '../../store/compartments';

/**
 * Trigger errors on form when switching from compartments
 */
const useCompartmentValidation = (
	activeCompartmentFormikRef: MutableRefObject<FormikProps<FormikValues> | undefined>,
	activeCompartment: CompartmentModel | undefined,
	hasSubmit = true
): void => {
	useEffect(() => {
		const { current: formikRef } = activeCompartmentFormikRef;

		if (hasSubmit && !activeCompartment?.isValid && formikRef) {
			formikRef.validateForm().then(errors => {
				if (!isEmpty(errors)) {
					// Set all fields with errors as touched
					formikRef.setTouched(setNestedObjectValues(errors, true));
					formikRef.setErrors(errors);
				}
			});
		}
	}, [activeCompartment, hasSubmit, activeCompartmentFormikRef, activeCompartmentFormikRef.current]); // eslint-disable-line
};

export default useCompartmentValidation;
