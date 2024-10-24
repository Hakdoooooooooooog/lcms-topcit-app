import { UserProfile } from "./user";

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
  setUserAuth: (user: UserAuthState["user"]) => void;
};

export type UserState = {
  user: UserProfile;
  isLoaded: boolean;
};

export type UserActions = {
  setUser: (user: UserState["user"]) => void;
  setIsLoaded: (isLoaded: UserState["isLoaded"]) => void;
};

export type PaginationState = {
  isSearching: boolean;
};

export type PaginationActions = {
  setIsSearching: (isSearching: PaginationState["isSearching"]) => void;
};

export type SearchState = {
  search: string;
};

export type SearchActions = {
  setSearch: (search: SearchState["search"]) => void;
};

export type InputPasswordState = {
  passType: "password" | "text";
  confirmPassType: "password" | "text";
};

export type InputPasswordActions = {
  setPassType: (type: InputPasswordState["passType"]) => void;
  setConfirmPassType: (type: InputPasswordState["confirmPassType"]) => void;
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
  setIsEdit: (isEdit: EditProfileState["isEdit"]) => void;
};

export type ModalState = {
  editContentModal: boolean;
  addContentModal: boolean;
};

export type ModalActions = {
  handleAddContentModal: () => void;
  handleEditContentModal: () => void;
};

export type AccordionState = {
  expanded: string | false;
};

export type AccordionActions = {
  setExpanded: (expanded: AccordionState["expanded"]) => void;
  handleChanges: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
};
