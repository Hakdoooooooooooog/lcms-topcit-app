import { MenuBook, QuizRounded } from '@mui/icons-material';
import { Container } from '@mui/material';
import { useTransition, useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Selections from '../../components/ui/Selections';
import { useAuthUserStore, useSearchStore } from '../../lib/store';
import { SelectionItems } from '../../lib/Types/types';
import { verifyUserAccessToken } from '../../api/User/userApi';
import { LoadingContentScreen } from '../../components/ui/LoadingScreen/LoadingScreen';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { showToast } from '../../components/ui/Toasts';
const AdminLayout = () => {
  const { role, setUserAuth } = useAuthUserStore((state) => ({
    role: state.user?.userRole,
    setUserAuth: state.setUserAuth,
  }));
  const setSearch = useSearchStore((state) => state.setSearch);
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('contents');
  const path = useLocation().pathname;

  const CardActionItems: SelectionItems = [
    {
      label: 'Contents',
      icon: (
        <MenuBook
          classes={{
            root: 'fill-current text-green-800',
          }}
        />
      ),
      to: '/admin/contents',
    },
    {
      label: 'Quizzes',
      icon: (
        <QuizRounded
          classes={{
            root: 'fill-current text-green-800',
          }}
        />
      ),
      to: '/admin/quiz',
    },
  ];

  useEffect(() => {
    setSearch('');

    if (path === '/admin') {
      setTab('admin');
    }

    if (role === 'admin') {
      verifyUserAccessToken()
        .then((res) => {
          if (res) {
            setUserAuth({
              isAuth: true,
              studentId: res.userData.studentId,
              userRole: res.userData.role,
            });
          }
        })
        .catch((err) => {
          showToast('There was an error: ' + err.message, 'error');
        });
    }
  }, [path, role]);

  if (role !== 'admin') {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: path,
          message: 'You are not authorized to view this page.',
          severity: 'error',
        }}
      />
    );
  }

  return (
    <Container maxWidth="xl" className="mt-10 pb-10">
      <h1 className="text-4xl font-semibold mb-12">
        Admin <span className="text-green-800">Hub</span>
      </h1>

      <Breadcrumbs path={path} />
      <Selections
        props={{ CardActionItems, path, startTransition, tab, setTab }}
      />

      {isPending ? <LoadingContentScreen /> : <Outlet />}
    </Container>
  );
};

export default AdminLayout;
