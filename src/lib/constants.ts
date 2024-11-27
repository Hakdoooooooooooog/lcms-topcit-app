import { styled, alpha, hexToRgb, TextareaAutosize } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { InputProps, LinkProps } from './Types/types';
import { lazy } from 'react';

// Search bar styles
export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '10px',
  backgroundColor: alpha(hexToRgb('#fff'), 0.75),
  marginRight: theme.spacing(1),
  marginLeft: 0,
  width: '100%',
  boxShadow: '2px 3px 3px 0 rgba(0, 0, 0, 0.5)',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '25ch',
        borderRadius: '10px',
      },
    },
  },
}));

export const AccordionSummaryTheme = {
  '.MuiAccordionSummary-content': {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  '&.Mui-expanded': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
};

export const styledModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

export const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px 12px 0 12px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === 'dark' ? grey[900] : grey[50]
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    outline: 0;
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === 'dark' ? blue[600] : blue[200]
    };
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

// Root routes
export const rootRoutes: LinkProps[] = [
  {
    name: 'Home',
    href: '/',
    component: lazy(() => import('../layouts/RootLayout')),
    sublinks: [
      {
        name: 'Home',
        isIndex: true,
        component: lazy(() => import('../pages/Others/Home')),
      },
      {
        name: 'About',
        href: 'about',
        component: lazy(() => import('../pages/Others/About')),
      },
      {
        name: 'Learning Hub',
        href: 'learning-hub',
        isLayoutComponent: true,
        component: lazy(() => import('../layouts/User/LearningHubLayout')),
        deepSubLinks: [
          {
            name: 'Main',
            isIndex: true,
            component: lazy(() => import('../pages/User/LearningHub/MainPage')),
          },
          {
            name: 'Syllabus',
            href: 'syllabus',
            component: lazy(() => import('../pages/User/LearningHub/Syllabus')),
          },
          {
            name: 'Media',
            href: 'media',
            component: lazy(() => import('../pages/User/LearningHub/Media')),
          },
          {
            name: 'Chapters',
            href: 'chapters',
            component: lazy(() => import('../pages/User/LearningHub/Chapters')),
          },
          {
            name: 'Resource-Library',
            href: 'resource-library',
            component: lazy(
              () => import('../pages/User/LearningHub/Resource Libraries'),
            ),
          },
        ],
      },
      {
        name: 'Assessment',
        href: 'assessment',
        isLayoutComponent: true,
        component: lazy(() => import('../layouts/User/AssessmentLayout')),
        deepSubLinks: [
          {
            name: 'Main',
            isIndex: true,
            component: lazy(() => import('../pages/User/Assessment')),
          },
        ],
      },
      {
        name: 'Progress Tracker',
        href: 'progress-tracker',
        isLayoutComponent: true,
        component: lazy(() => import('../layouts/User/ProgressTrackerLayout')),
        deepSubLinks: [
          {
            name: 'Main',
            isIndex: true,
            component: lazy(
              () => import('../pages/User/ProgressTracker/MainPage'),
            ),
          },
          {
            name: 'Contents',
            href: 'contents',
            component: lazy(
              () => import('../pages/User/ProgressTracker/Contents'),
            ),
          },
          {
            name: 'Assessments',
            href: 'assessments',
            component: lazy(
              () => import('../pages/User/ProgressTracker/Assessments'),
            ),
          },
        ],
      },
      {
        name: 'Profile',
        href: 'profile',
        isLayoutComponent: true,
        component: lazy(() => import('../layouts/User/ProfileLayout')),
        deepSubLinks: [
          {
            name: 'Profile',
            isIndex: true,
            component: lazy(() => import('../pages/User/Profile')),
          },
        ],
      },
      {
        name: 'Join Us',
        href: 'landing',
        isLayoutComponent: true,
        component: lazy(() => import('../layouts/Others/LandingLayout')),
        deepSubLinks: [
          {
            name: 'Login',
            isIndex: true,
            component: lazy(() => import('../pages/Others/Landing/Login')),
          },
          {
            name: 'Register',
            href: 'register',
            component: lazy(() => import('../pages/Others/Landing/Register')),
          },
          {
            name: 'Forgot Password',
            href: 'forgot-password',
            component: lazy(
              () => import('../pages/Others/Landing/Forgot-Password'),
            ),
          },
        ],
      },
      {
        name: 'Admin',
        href: 'admin',
        isLayoutComponent: true,
        component: lazy(() => import('../layouts/Admin/AdminLayout')),
        deepSubLinks: [
          {
            name: 'Main',
            isIndex: true,
            component: lazy(() => import('../pages/Admin')),
          },
          {
            name: 'Contents',
            href: 'contents',
            component: lazy(() => import('../pages/Admin/AdminHub/Contents')),
          },
          {
            name: 'Quiz',
            href: 'quiz',
            component: lazy(() => import('../pages/Admin/AdminHub/Quiz')),
          },
          {
            name: 'Resource Library',
            href: 'resource-library',
            component: lazy(
              () => import('../pages/Admin/AdminHub/ResourceLibrary'),
            ),
          },
        ],
      },
    ],
  },
];

// islanding page links
export const landingPaths = [
  '/landing',
  '/landing/register',
  '/landing/forgot-password',
];

// Fields for the user form
export const setLoginFields: Array<InputProps> = [
  {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    name: 'email',
    value: '',
  },
  {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    name: 'password',
    value: '',
  },
];

export const setRegisterFields: Array<InputProps> = [
  {
    label: 'User ID',
    type: 'text',
    placeholder: 'Enter your user ID',
    name: 'userid',
    value: '',
  },
  {
    label: 'Username',
    type: 'text',
    placeholder: 'Enter your username',
    name: 'username',
    value: '',
  },
  {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    name: 'email',
    value: '',
  },
  {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    name: 'password',
    value: '',
  },
  {
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your password',
    name: 'confirmPassword',
    value: '',
  },
];

export const excludedSearchPaths = new Set([
  '/learning-hub',
  '/progress-tracker',
  '/admin',
]);

export const addChapterFormInputs = [
  {
    label: 'Topic ID',
    name: 'topicId',
    type: 'text',
    id: 'topicId',
  },
  {
    label: 'Chapter Number',
    name: 'chapterNum',
    type: 'text',
    id: 'chapterNum',
  },
  {
    label: ' Chapter File',
    name: 'chapterFile',
    type: 'file',
    id: 'chapterFile',
  },
  {
    label: 'Chapter Title',
    name: 'chapterTitle',
    type: 'text',
    id: 'chapterTitle',
  },
  {
    label: 'Chapter Description',
    name: 'chapterDescription',
    type: 'text',
    id: 'chapterDescription',
  },
];

export const addTopicFormInputs = [
  {
    label: 'Topic Number',
    name: 'topicNum',
    type: 'text',
    id: 'topicNum',
  },
  {
    label: 'Topic Title',
    name: 'topicName',
    type: 'text',
    id: 'topicName',
  },
  {
    label: 'Topic Description',
    name: 'topicDescription',
    type: 'text',
    id: 'topicDescription',
  },
];

export const addSubChapterFormInputs = [
  {
    label: 'Sub-Chapter Number',
    name: 'subChapterNum',
    type: 'text',
    id: 'subChapterNum',
  },
  {
    label: 'Parent Chapter Number',
    name: 'parentChapterNum',
    type: 'text',
    id: 'parentChapterNum',
  },
  {
    label: 'Sub-Chapter File',
    name: 'subChapterFile',
    type: 'file',
    id: 'subChapterFile',
  },
  {
    label: 'Sub-Chapter Title',
    name: 'subChapterTitle',
    type: 'text',
    id: 'subChapterTitle',
  },
  {
    label: 'Sub-Chapter Description',
    name: 'subChapterDescription',
    type: 'text',
    id: 'subChapterDescription',
  },
];

export const editChapterFormInputs = [
  {
    label: 'Chapter File',
    name: 'chapterFile',
    type: 'file',
    id: 'chapterFile',
  },
  {
    label: 'Chapter Title',
    name: 'chapterTitle',
    type: 'text',
    id: 'chapterTitle',
  },
  {
    label: 'Chapter Description',
    name: 'chapterDescription',
    type: 'text',
    id: 'chapterDescription',
  },
];

export const editTopicFormInputs = [
  {
    label: 'Topic Title',
    name: 'topicTitle',
    type: 'text',
    id: 'topicTitle',
  },
  {
    label: 'Topic Description',
    name: 'description',
    type: 'text',
    id: 'description',
  },
];

export const tutorialSteps = [
  {
    label: 'Step 1',
    content: `Use the arrow keys to navigate through the questions or
    swipe left or right on mobile devices.`,
    img: './chillguy-gID_7.webp',
  },
  {
    label: 'Step 2',
    content: 'Click the "Next" button to move to the next question.',
    img: './queen-dont-cry.png',
  },
  {
    label: 'Step 3',
    content: 'Click the "Previous" button to move to the previous question.',
    img: './chillguy-gID_7.webp',
  },
  {
    label: 'Step 4',
    content: 'Click the "Submit" button to submit your answers.',
    img: './chillguy-gID_7.webp',
  },
];
