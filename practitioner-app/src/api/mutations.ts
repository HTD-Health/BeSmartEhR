import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { assignForms, finishTask, submitResponse } from './api';
import { FinishTaskParams, FormMeta, SubmitResponseParams } from './models';

const useAssignForms = (): UseMutationResult<string[], unknown, FormMeta[], unknown> => {
    const queryClient = useQueryClient();
    return useMutation(assignForms, {
        onSuccess: () => {
            queryClient.invalidateQueries('getFormAssignments');
        }
    });
};

const useSubmitResponse = (): UseMutationResult<string, unknown, SubmitResponseParams, unknown> =>
    useMutation(submitResponse);

const useFinishTask = (): UseMutationResult<string, unknown, FinishTaskParams, unknown> => {
    const queryClient = useQueryClient();
    return useMutation(finishTask, {
        onSuccess: () => {
            queryClient.invalidateQueries('getFilledForms');
            queryClient.invalidateQueries('getFormAssignments');
        }
    });
};

// eslint-disable-next-line import/prefer-default-export
export { useAssignForms, useSubmitResponse, useFinishTask };
