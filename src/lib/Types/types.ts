import { UserProfile } from './user';

// Link props types
export type LinkProps = {
  name: string;
  href: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  sublinks?: SublinkProps[];
};

export type SublinkProps = {
  name: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  href?: string;
  isIndex?: boolean;
  requiresAuth?: boolean;
  isLayoutComponent?: boolean;
  isComponentUsesParams?: boolean;
  deepSubLinks?: SublinkProps[];
};
export type InputProps = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
};

export type UserAuthState = {
  user: {
    isAuth: boolean;
    userId?: string;
    userRole?: string;
  };
};

export type UserAuthActions = {
  setUserAuth: (user: UserAuthState['user']) => void;
};

export type UserState = {
  user: UserProfile;
  isLoaded: boolean;
};

export type UserActions = {
  setUser: (user: UserState['user']) => void;
  setIsLoaded: (isLoaded: UserState['isLoaded']) => void;
};

export type PaginationState = {
  isSearching: boolean;
};

export type PaginationActions = {
  setIsSearching: (isSearching: PaginationState['isSearching']) => void;
};

export type SearchState = {
  search: string;
};

export type SearchActions = {
  setSearch: (search: SearchState['search']) => void;
};

export type InputPasswordState = {
  passType: 'password' | 'text';
  confirmPassType: 'password' | 'text';
};

export type InputPasswordActions = {
  setPassType: (type: InputPasswordState['passType']) => void;
  setConfirmPassType: (type: InputPasswordState['confirmPassType']) => void;
};

export type SelectionItems = {
  label: string;
  icon: JSX.Element;
  to: string;
}[];

export type EditProfileState = {
  isEdit: boolean;
};

export type EditProfileActions = {
  setIsEdit: (isEdit: EditProfileState['isEdit']) => void;
};

export type ModalState = {
  editContentModal: boolean;
  addContentModal: boolean;
  openCancelModal: boolean;
  openTutorialModal: boolean;
  openSubmitModal: boolean;
};

export type ModalActions = {
  setOpenSubmitModal: (openSubmitModal: ModalState['openSubmitModal']) => void;
  setOpenTutorialModal: (
    openTutorialModal: ModalState['openTutorialModal'],
  ) => void;
  setOpenCancelModal: (openCancelModal: ModalState['openCancelModal']) => void;

  handleAddContentModal: () => void;
  handleEditContentModal: () => void;
};

// Accordion types
export type AccordionState = {
  expanded: string | false;
};

export type AccordionActions = {
  setExpanded: (expanded: AccordionState['expanded']) => void;
  handleChanges: (
    panel: string,
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

// Slider types
export type SliderState = {
  currentSliderSlide: number;
  totalSlides: number;
};

export type SliderActions = {
  setCurrentSlide: (currentSlide: SliderState['currentSliderSlide']) => void;
  setTotalSlides: (totalSlides: SliderState['totalSlides']) => void;
};

// Quiz types
export type QuizState = {
  value: {
    [key: string]: string;
  };
  isBlocked: boolean;
};
export type QuizActions = {
  setValue: (value: QuizState['value']) => void;
  setIsBlocked: (isBlocked: QuizState['isBlocked']) => void;
};
