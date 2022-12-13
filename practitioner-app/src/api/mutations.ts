import { useMutation, UseMutationResult } from 'react-query';

import { assignForms } from './api';
import { FormMeta } from './models';

const useAssignForms = (): UseMutationResult<string[], unknown, FormMeta[], unknown> =>
    useMutation(assignForms, {
        // TODO: invalidate assigned forms query
        // onSuccess: (d) => {}
    });

// eslint-disable-next-line import/prefer-default-export
export { useAssignForms };
