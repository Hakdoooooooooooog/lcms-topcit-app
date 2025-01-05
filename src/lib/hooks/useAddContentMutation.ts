import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../components/ui/Toasts';

type AddMutationProps<T> = {
  fn: (data: T) => Promise<T>;
  QueryKey: string;
  handleClose?: () => void;
};

const useAddContentMutation = <T>({
  fn,
  QueryKey,
  handleClose,
}: AddMutationProps<T>) => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey] });
      handleClose && handleClose();
      showToast('Content added successfully', 'success');
    },
    onError: (error) => {
      showToast(error.message, 'error');
    },
  });

  return addMutation;
};

export default useAddContentMutation;
