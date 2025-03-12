import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { addGoal, assignForms, finishTask, submitResponse } from './api';
import { FinishTaskParams, FormMeta, SubmitResponseParams } from './models';

const useAssignForms = (): UseMutationResult<string[], unknown, FormMeta[], unknown> => {
    const queryClient = useQueryClient();
    return useMutation(assignForms, {
        onSuccess: () => {
            queryClient.invalidateQueries('getFormAssignments');
        }
    });
};

const useCreateGoal = (): UseMutationResult<string, unknown, string, unknown> => {
    const queryClient = useQueryClient();
    return useMutation(addGoal, {
        onSuccess: () => {
            queryClient.invalidateQueries('getGoals');
        }
    });
}

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
export { useAssignForms, useSubmitResponse, useFinishTask, useCreateGoal };
