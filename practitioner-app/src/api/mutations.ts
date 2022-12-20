import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { assignForms } from './api';
import { FormMeta } from './models';

const useAssignForms = (): UseMutationResult<string[], unknown, FormMeta[], unknown> => {
    const queryClient = useQueryClient();
    return useMutation(assignForms, {
        onSuccess: () => {
            queryClient.invalidateQueries('getFormAssignments');
        }
    });
};

// eslint-disable-next-line import/prefer-default-export
export { useAssignForms };
