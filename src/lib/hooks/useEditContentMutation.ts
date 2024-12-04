import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../components/ui/Toasts';

type EditMutationProps<T> = {
  fn: (data: T) => Promise<T>;
  QueryKey: string[] | string;
  handleClose?: () => void;
};

const useEditContentMutation = <T>({
  fn,
  QueryKey,
  handleClose,
}: EditMutationProps<T>) => {
  const queryClient = useQueryClient();
  const editMutation = useMutation({
    mutationFn: fn,
    onSuccess: () => {
      if (Array.isArray(QueryKey)) {
        QueryKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      } else {
        queryClient.invalidateQueries({ queryKey: [QueryKey] });
      }

      showToast('Content updated successfully', 'success');
      handleClose && handleClose();
    },
    onError: (error) => {
      showToast(error.message, 'error');
    },
  });

  return editMutation;
};

export default useEditContentMutation;
