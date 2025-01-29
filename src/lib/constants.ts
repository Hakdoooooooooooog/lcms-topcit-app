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
  width: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,

  '@media (min-width: 600px)': {
    width: '50%',
  },
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
            name: 'Chapters',
            href: 'chapters',
            component: lazy(() => import('../pages/User/LearningHub/Chapters')),
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
          {
            name: 'OTP Verification',
            href: 'otp-verification',
            component: lazy(
              () => import('../pages/Others/Landing/OTP-Verification'),
            ),
          },
          {
            name: 'New Password',
            href: 'new-password',
            component: lazy(
              () => import('../pages/Others/Landing/New-Password'),
            ),
          },
          {
            name: 'Success',
            href: 'success',
            component: lazy(() => import('../pages/Others/Landing/Success')),
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
  '/landing/otp-verification',
  '/landing/new-password',
  '/landing/success',
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
    label: 'Student ID',
    type: 'text',
    placeholder: 'Enter your student ID',
    name: 'studentId',
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
  {
    label: 'OTP',
    type: 'text',
    placeholder: 'Enter 6-digit OTP',
    name: 'otp',
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

export const editTopicFormInputs: InputProps[] = [
  {
    label: 'Topic Title',
    name: 'topicTitle',
    type: 'text',
    value: '',
    placeholder: 'Enter the topic title',
  },
  {
    label: 'Topic Description',
    name: 'description',
    type: 'text',
    value: '',
    placeholder: 'Enter the topic description',
  },
];

export const addQuizFormInputs: {
  stage1: {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    value: string;
    disabled?: boolean;
  }[];
  stage2: {
    multipleChoiceOptions?: {
      label: string;
      name: string;
      type: string;
      placeholder: string;
      value: string;
      disabled?: boolean;
    }[];
    identificationOptions?: {
      label: string;
      name: string;
      type: string;
      placeholder: string;
      value: string;
      disabled?: boolean;
    }[];
  };
} = {
  stage1: [
    {
      label: 'Topic ID',
      name: 'topicId',
      type: 'text',
      placeholder: 'Enter the topic ID',
      value: '',
      disabled: true,
    },
    {
      label: 'Chapter Select',
      name: 'chapterSelect',
      type: 'chapterSelection',
      placeholder: 'Select a chapter',
      value: '',
      disabled: true,
    },
    {
      label: 'Quiz Title',
      name: 'quizTitle',
      type: 'text',
      placeholder: 'Enter the quiz title',
      value: '',
    },
    {
      label: 'Max Attempts',
      name: 'maxAttempts',
      type: 'text',
      placeholder: 'Enter the maximum number of attempts',
      value: '',
    },
    {
      label: 'Number of Questions',
      name: 'numofQuestions',
      type: 'text',
      placeholder: 'Enter the number of questions',
      value: '',
    },
  ],
  stage2: {
    multipleChoiceOptions: [
      {
        label: 'Quiz ID',
        name: 'quizId',
        type: 'text',
        placeholder: 'Enter the quiz ID',
        value: '',
        disabled: true,
      },
      {
        label: 'Question Description',
        name: 'question',
        type: 'text',
        placeholder: 'Enter the question description',
        value: '',
      },
      {
        label: 'Question Type',
        name: 'questionType',
        type: 'questionTypeSelection',
        placeholder: 'Enter the question type',
        value: '',
      },
      {
        label: 'Correct Answer',
        name: 'correctAnswer',
        type: 'correctAnswerSelection',
        placeholder: 'Enter the correct answer',
        value: '',
      },
    ],
    identificationOptions: [
      {
        label: 'Quiz ID',
        name: 'quizId',
        type: 'text',
        placeholder: 'Enter the quiz ID',
        value: '',
        disabled: true,
      },
      {
        label: 'Question Description',
        name: 'question',
        type: 'text',
        placeholder: 'Enter the question description',
        value: '',
      },
      {
        label: 'Question Type',
        name: 'questionType',
        type: 'questionTypeSelection',
        placeholder: 'Enter the question type',
        value: '',
      },
      {
        label: 'Correct Answer',
        name: 'correctAnswer',
        type: 'text',
        placeholder: 'Enter the correct answer',
        value: '',
      },
    ],
  },
};

export const multipleChoiceOptions = [
  {
    label: 'Option Text',
    name: 'optionText',
    type: 'text',
    placeholder: 'Enter the option text',
    value: '',
  },
];

export const tutorialSteps: Array<{
  label: string;
  content: string;
  img?: string | null;
}> = [
  {
    label: 'Step 1',
    content: 'Click the "Next" button to move to the next question.',
    img: '/tutorial/tut_1.gif',
  },
  {
    label: 'Step 2',
    content: 'Click the "Previous" button to move to the previous question.',
    img: '/tutorial/tut_2.gif',
  },
  {
    label: 'Step 3',
    content: 'Click the "Submit" button to submit your answers.',
    img: '/tutorial/tut_3.gif',
  },
  {
    label: 'Step 4',
    content:
      'Caution: Once you click the "Submit" button, you cannot go back. Make sure to review your answers before submitting.',
    img: null,
  },
  {
    label: 'Step 5',
    content: 'Good luck!',
    img: null,
  },
];

export const testimonies = [
  {
    name: 'Shania Gwyneth E. Nuga (2024)',
    testimonyText:
      'TOPCIT Examination has become a mind opening for me as a computer science student because of the topics covered in the examination that could help us in our field. This examination tests our knowledge in information technology and computer science and how we could apply it in real world scenarios. One of the benefits of taking this exam is the certificate acquired here could serve as a proof of our expertise in the field.',
  },
  {
    name: 'Anonymous TOPCIT Taker (2024)',
    testimonyText:
      'I found the TOPCIT exam to be an excellent way to evaluate my skills, especially in areas like coding and IT problem-solving. It’s definitely challenging, but the emphasis on practical applications made it worthwhile. I would recommend it because it helps you understand your strengths and weaknesses while preparing for real-world IT tasks.',
  },
  {
    name: 'Anonymous TOPCIT Taker (2024)',
    testimonyText:
      'Before the exam, I didn’t know much about it, so I faced some difficulties preparing. Despite that, it turned out to be an eye-opener, pointing out the gaps in my knowledge that I need to work on. I think others should take it as well because it sets a benchmark for IT skills and helps you grow professionally.',
  },
  {
    name: 'Anonymous TOPCIT Taker (2024)',
    testimonyText:
      'TOPCIT does a great job balancing theory and technical assessments. I enjoyed how it focused on practical skills, and the results gave me clear feedback on where I stand in terms of industry readiness. It’s an impressive credential to have and shows employers you’re serious about your IT career.',
  },
  {
    name: 'Anonymous TOPCIT Taker (2024)',
    testimonyText:
      'TOPCIT can be helpful to know which field you know best and what you should learn more about.',
  },
];

export const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@4.4.168/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@4.4.168/standard_fonts`,
};
