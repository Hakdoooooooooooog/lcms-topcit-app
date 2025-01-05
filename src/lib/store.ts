import { create } from 'zustand';
import {
  AccordionActions,
  AccordionState,
  EditProfileActions,
  EditProfileState,
  InputPasswordActions,
  InputPasswordState,
  ModalActions,
  ModalState,
  PaginationActions,
  PaginationState,
  SearchActions,
  SearchState,
  SliderState,
  SliderActions,
  UserActions,
  UserAuthActions,
  UserAuthState,
  UserState,
  QuizActions,
  QuizState,
} from './Types/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import { OTPVerificationActions, OTPVerificationState } from './Types/user';

export const useInputPasswordStore = create<
  InputPasswordState & InputPasswordActions
>((set) => ({
  passType: 'password',
  confirmPassType: 'password',
  setPassType: (type) => set({ passType: type }),
  setConfirmPassType: (type) => set({ confirmPassType: type }),
}));

export const useAuthUserStore = create<UserAuthState & UserAuthActions>()(
  persist(
    (set) => ({
      user: {
        isAuth: false,
        userId: '',
        userRole: '',
      },
      setUserAuth: (user) =>
        set((state) => ({ user: { ...state.user, ...user } })),
    }),
    {
      name: 'session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export const usePaginationStore = create<PaginationState & PaginationActions>(
  (set) => ({
    isSearching: false,
    setIsSearching: (isSearching) => set({ isSearching }),
  }),
);

export const useUserStore = create<UserState & UserActions>((set) => ({
  user: {
    email: '',
    userid: 0,
    username: '',
  },
  isLoaded: false,
  setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));

export const useSearchStore = create<SearchState & SearchActions>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
}));

export const useEditProfileStore = create<
  EditProfileState & EditProfileActions
>((set) => ({
  isEdit: false,
  setIsEdit: (isEdit: boolean) => set({ isEdit }),
}));

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  addContentModal: false,
  editContentModal: false,
  openCancelModal: false,
  openSubmitModal: false,
  openTutorialModal: false,

  setOpenCancelModal: (openCancelModal) =>
    set((prevState) => ({ ...prevState, openCancelModal })),
  setOpenSubmitModal: (openSubmitModal) =>
    set((prevState) => ({ ...prevState, openSubmitModal })),
  setOpenTutorialModal: (openTutorialModal) =>
    set((prevState) => ({ ...prevState, openTutorialModal })),

  handleAddContentModal: () =>
    set((state) => ({ addContentModal: !state.addContentModal })),
  handleEditContentModal: () =>
    set((state) => ({ editContentModal: !state.editContentModal })),
}));

export const useAccordionStore = create<AccordionState & AccordionActions>(
  (set) => ({
    expanded: false,
    setExpanded: (expanded) => set({ expanded }),
    handleChanges: (panel) => (_event, isExpanded) =>
      set({ expanded: isExpanded ? panel : false }),
  }),
);

export const useSliderAssessmentStore = create<SliderState & SliderActions>(
  (set) => ({
    currentSliderSlide: 0,
    totalSlides: 0,

    setCurrentSlide: (currentSliderSlide) =>
      set((prev) => ({ ...prev, currentSliderSlide })),
    setTotalSlides: (totalSlides) => set((prev) => ({ ...prev, totalSlides })),
  }),
);

export const useSliderQuizStore = create<SliderState & SliderActions>(
  (set) => ({
    currentSliderSlide: 0,
    totalSlides: 0,

    setCurrentSlide: (currentSliderSlide) =>
      set((prev) => ({ ...prev, currentSliderSlide })),
    setTotalSlides: (totalSlides) => set((prev) => ({ ...prev, totalSlides })),
  }),
);

export const useQuizStore = create<QuizState & QuizActions>()(
  persist(
    (set) => ({
      value: {},
      isBlocked: false,
      setValue: (value) => set({ value }),
      setIsBlocked: (isBlocked) => set({ isBlocked }),
    }),
    {
      name: 'quiz-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useForgotPasswordStore = create<
  OTPVerificationState & OTPVerificationActions
>((set) => ({
  email: '',
  otp: '',
  setEmail: (email) => set({ email }),
  setOTP: (otp) => set({ otp }),
}));
