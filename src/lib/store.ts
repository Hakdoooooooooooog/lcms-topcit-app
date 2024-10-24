import { create } from "zustand";
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
  UserActions,
  UserAuthActions,
  UserAuthState,
  UserState,
} from "./Types/types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useInputPasswordStore = create<InputPasswordState & InputPasswordActions>((set) => ({
  passType: "password",
  confirmPassType: "password",
  setPassType: (type) => set({ passType: type }),
  setConfirmPassType: (type) => set({ confirmPassType: type }),
}));

export const useAuthUserStore = create<UserAuthState & UserAuthActions>()(
  persist(
    (set) => ({
      user: {
        isAuth: false,
        userId: "",
        userRole: "",
      },
      setUserAuth: (user) => set({ user }),
    }),
    {
      name: "session",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const usePaginationStore = create<PaginationState & PaginationActions>((set) => ({
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),
}));

export const useUserStore = create<UserState & UserActions>((set) => ({
  user: {
    email: "",
    userID: 0n,
    username: "",
  },
  isLoaded: false,
  setUser: (user) => set({ user }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));

export const useSearchStore = create<SearchState & SearchActions>((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));

export const useEditProfileStore = create<EditProfileState & EditProfileActions>((set) => ({
  isEdit: false,
  setIsEdit: (isEdit: boolean) => set({ isEdit }),
}));

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  addContentModal: false,
  editContentModal: false,

  handleAddContentModal: () => set((state) => ({ addContentModal: !state.addContentModal })),
  handleEditContentModal: () => set((state) => ({ editContentModal: !state.editContentModal })),
}));

export const useAccordionStore = create<AccordionState & AccordionActions>((set) => ({
  expanded: false,
  setExpanded: (expanded) => set({ expanded }),
  handleChanges: (panel) => (_event, isExpanded) => set({ expanded: isExpanded ? panel : false }),
}));
