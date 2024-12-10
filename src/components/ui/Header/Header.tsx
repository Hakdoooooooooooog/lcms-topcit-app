import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import headerStyle from './Header.module.css';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { LinkProps } from '../../../lib/Types/types';
import { handleNavMenu } from '../../../lib/helpers/utils';
import { useAuthUserStore } from '../../../lib/store';
import { userLogout } from '../../../api/User/userApi';
import { showToast } from '../Toasts';
import TOPCIT from '../../TOPCITLogo';

const Header = ({ links }: { links: LinkProps[] }) => {
  const { anchorElNav, handleOpenNavMenu, handleCloseNavMenu } =
    handleNavMenu();
  const user = useAuthUserStore((state) => state.user);
  const setUserAuth = useAuthUserStore((state) => state.setUserAuth);

  const itemLinks = useMemo(
    () =>
      links[0].sublinks
        ?.filter(
          (sublink) => sublink.name !== 'Home' && sublink.name !== 'About',
        )
        .map((sublink, index) => {
          if (sublink.name === 'Join Us' && user.isAuth) {
            return null;
          }

          return sublink.href && user.userRole === 'admin' ? (
            sublink.name === 'Admin' ? (
              <NavLink key={index} to={sublink.href} id={sublink.name}>
                {sublink.name}
              </NavLink>
            ) : null
          ) : sublink.href && user.userRole !== 'admin' ? (
            sublink.name !== 'Admin' ? (
              <NavLink key={index} to={sublink.href || ''} id={sublink.name}>
                {sublink.name}
              </NavLink>
            ) : null
          ) : null;
        }),
    [links, user.isAuth, user.userRole],
  );

  const handleLogout = async () => {
    const res = await userLogout();

    if (res.message === 'Logged out') {
      setUserAuth({ isAuth: false, userId: '', userRole: '' });
      sessionStorage.removeItem('session');
      showToast('Logged out successfully', 'success');
    }
  };

  return (
    <AppBar position="static" className={headerStyle.header}>
      <Container maxWidth="xl">
        <Toolbar component={'nav'} className={headerStyle.nav}>
          <Box
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <Box className={headerStyle.main_link}>
              {links.map((link, index) =>
                link.name === 'Home' ? (
                  <NavLink key={index} to={link.href} id="Home">
                    <TOPCIT />
                  </NavLink>
                ) : null,
              )}
            </Box>

            <Box className={headerStyle.secondary_links}>
              {itemLinks}
              {user.isAuth ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                  className={headerStyle.link}
                >
                  Logout
                </Button>
              ) : null}
            </Box>
          </Box>

          <Box
            component={'div'}
            sx={{
              alignItems: 'center',
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <Tooltip title="Menu" arrow>
              <IconButton
                sx={{
                  bgcolor: 'transparent',
                  maxHeight: 48,
                }}
                disableFocusRipple={true}
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>

            <Menu
              classes={{
                list: headerStyle.menu_list,
              }}
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {itemLinks}
              {user.isAuth ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                  className={headerStyle.link}
                >
                  Logout
                </Button>
              ) : null}
            </Menu>

            <Box
              sx={{
                flexGrow: 1,
                justifyContent: 'center',
                display: { xs: 'flex', md: 'none' },
              }}
              className={headerStyle.main_link}
            >
              {links.map((link, index) =>
                link.name === 'Home' ? (
                  <NavLink key={index} to={link.href} id="Home">
                    <TOPCIT />
                  </NavLink>
                ) : null,
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
