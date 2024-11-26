import { useEffect, useState, useTransition } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LibraryBooks, MenuBook, PermMedia, Toc } from '@mui/icons-material';
import Selections from '../../components/ui/Selections';
import { Container } from '@mui/material';
import { useSearchStore } from '../../lib/store';
import { SelectionItems } from '../../lib/Types/types';
import { LoadingContentScreen } from '../../components/ui/LoadingScreen/LoadingScreen';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const CardActionItems: SelectionItems = [
  {
    label: 'Syllabus',
    icon: (
      <LibraryBooks
        classes={{
          root: 'fill-current text-green-800',
        }}
      />
    ),
    to: '/learning-hub/syllabus',
  },
  {
    label: 'Chapters',
    icon: (
      <MenuBook
        classes={{
          root: 'fill-current text-green-800',
        }}
      />
    ),
    to: '/learning-hub/chapters',
  },
  {
    label: 'Media',
    icon: (
      <Toc
        classes={{
          root: 'fill-current text-green-800',
        }}
      />
    ),
    to: '/learning-hub/media',
  },
  {
    label: 'Resource Library',
    icon: (
      <PermMedia
        classes={{
          root: 'fill-current text-green-800',
        }}
      />
    ),
    to: '/learning-hub/resource-library',
  },
];

const LearningHubLayout = () => {
  const path = useLocation().pathname;
  const setSearch = useSearchStore((state) => state.setSearch);
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('syllabus');

  useEffect(() => {
    setSearch('');

    if (path === '/learning-hub') {
      setTab('learning-hub');
    }
  }, [path]);

  return (
    <Container maxWidth="xl" className="mt-10">
      <h1 className="text-4xl font-semibold mb-12">
        Learning <span className="text-green-800">Hub</span>
      </h1>

      <Breadcrumbs path={path} />

      <Selections
        props={{ CardActionItems, path, startTransition, tab, setTab }}
      />

      {isPending ? <LoadingContentScreen /> : <Outlet />}
    </Container>
  );
};

export default LearningHubLayout;
