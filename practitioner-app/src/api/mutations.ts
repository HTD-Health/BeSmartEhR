import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { addGoal, assignForms, finishTask, submitResponse } from './api';
import { FinishTaskParams, FormMeta, SubmitResponseParams } from './models';

const useAssignForms = (): UseMutationResult<string[], unknown, FormMeta[], unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: assignForms,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getFormAssignments'] });
        }
    });
};

const useCreateGoal = (): UseMutationResult<string, unknown, string, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getGoals'] });
        }
    });
};

const useSubmitResponse = (): UseMutationResult<string, unknown, SubmitResponseParams, unknown> =>
    useMutation({ mutationFn: submitResponse });

const useFinishTask = (): UseMutationResult<string, unknown, FinishTaskParams, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: finishTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getFilledForms'] });
            queryClient.invalidateQueries({ queryKey: ['getFormAssignments'] });
        }
    });
};

export { useAssignForms, useCreateGoal, useFinishTask, useSubmitResponse };
