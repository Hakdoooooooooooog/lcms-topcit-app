import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitQuiz } from '../../api/User/quizApi';
import { showToast } from '../../components/ui/Toasts';

const useAssessmentMutation = () => {
  const queryClient = useQueryClient();

  const assessmentMutation = useMutation({
    mutationFn: (data: {
      assessmentData: {
        [key: string]: string;
      };
      quizData: {
        topicId: string;
        userId: string;
        quizId: string;
      };
    }) => submitQuiz(data.assessmentData, data.quizData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['AssessmentQuizzes'] });

      showToast('Quiz Submitted', 'success');
    },
    onError: (error) => {
      showToast('An error occurred' + error, 'error');
    },
    mutationKey: ['AssessmentQuizzes'],
  });

  return assessmentMutation;
};

export default useAssessmentMutation;
