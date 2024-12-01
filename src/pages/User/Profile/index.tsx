import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import UserForm from '../../../components/ui/Form/UserForm';
import { ProfileForm } from '../../../components/ui/Form/ProfileForm';
import { ProfileSchema } from '../../../lib/schema/UserSchema';
import { useEffect, useRef } from 'react';
import { useEditProfileStore, useUserStore } from '../../../lib/store';
import { LoadingButton } from '../../../components/ui/LoadingScreen/LoadingScreen';

type ProfileSchema = z.infer<typeof ProfileSchema>;

const Profile = () => {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const { isEdit, setIsEdit } = useEditProfileStore((state) => ({
    isEdit: state.isEdit,
    setIsEdit: state.setIsEdit,
  }));
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(ProfileSchema),
    values: { ...user, userid: user.userid.toString() },
  });

  const handleIsEditing = () => {
    setIsEdit(!isEdit);
  };

  useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus();
    } else {
      clearErrors();
    }
  }, [isEdit]);

  return (
    <Box
      sx={{
        margin: 'auto',
        width: '100%',
        maxWidth: '800px',
      }}
    >
      <UserForm
        handleSubmit={handleSubmit}
        schema={ProfileSchema}
        FormType={'Edit-Profile'}
      >
        <Box component={'section'} className="flex flex-col gap-5">
          <ProfileForm
            userData={user}
            isEditing={isEdit}
            register={register}
            errors={errors}
            ref={inputRef}
          />
        </Box>

        <Box component={'section'} className="flex flex-col gap-5 pt-4">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
              gap: '1%',
            }}
          >
            {!isEdit && (
              <Button
                type="button"
                sx={{
                  flex: '1 1 100%',
                }}
                variant="contained"
                onClick={handleIsEditing}
              >
                Edit
              </Button>
            )}

            {isEdit && (
              <>
                <Button
                  type="submit"
                  sx={{
                    flex: '1 1 100%',
                  }}
                  variant="contained"
                  disabled={isSubmitting}
                  className={isSubmitting ? 'cursor-not-allowed' : ''}
                  endIcon={isSubmitting ? <LoadingButton /> : null}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  sx={{
                    flex: '1 1 100%',
                  }}
                  variant="contained"
                  onClick={handleIsEditing}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>
      </UserForm>
    </Box>
  );
};

export default Profile;
