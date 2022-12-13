import { useMutation, UseMutationResult } from 'react-query';

import { assignForms } from './api';
import { FormMeta } from './models';

const useAssignForms = (formDataList: FormMeta[]): UseMutationResult<string[], unknown, FormMeta[], unknown> =>
    useMutation(() => assignForms(formDataList), {
        onSuccess: (d) => {
            // TODO: invalidate assigned forms query
            console.log(d);
        }
    });

// eslint-disable-next-line import/prefer-default-export
export { useAssignForms };
