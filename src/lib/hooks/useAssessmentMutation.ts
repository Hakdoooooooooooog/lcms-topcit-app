import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitQuiz } from '../../api/User/quizApi';
import { showToast } from '../../components/ui/Toasts';

const useAssessmentMutation = () => {
  const queryClient = useQueryClient();

  const assessmentMutation = useMutation({
    mutationFn: (data: {
      topicId: string;
      quizId: string;
      assessmentData: {
        [key: string]: string;
      };
    }) => submitQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['AssessmentQuizzes'] });

      showToast('Quiz Submitted', 'success');
    },
    onError: (error) => {
      showToast('An error occurred: ' + error.message, 'error');
    },
    mutationKey: ['AssessmentQuizzes'],
  });

  return assessmentMutation;
};

export default useAssessmentMutation;
