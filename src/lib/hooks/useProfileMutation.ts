import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../../components/ui/Toasts";
import { useEditProfileStore } from "../store";
import { updateUserProfile } from "../../api/User/userApi";

const useProfileMutation = () => {
  const queryClient = useQueryClient();
  const setIsEdit = useEditProfileStore((state) => state.setIsEdit);

  const profileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      setIsEdit(false);
      showToast("Profile Updated", "success");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: () => {
      showToast("An error occurred", "error");
    },
  });

  return profileMutation;
};

export default useProfileMutation;
