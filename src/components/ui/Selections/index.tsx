import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Card, CardActions, Tooltip } from '@mui/material';
import { useSearchStore } from '../../../lib/store';
import { SelectionItems } from '../../../lib/Types/types';
import { excludedSearchPaths } from '../../../lib/constants';
import SearchInput from '../SearchInput/SearchInput';
import styles from './Selections.module.css';

type SelectionProps = {
  CardActionItems: SelectionItems;
  path: string;
  startTransition: React.TransitionStartFunction;
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
};

const Selections = ({ props }: { props: SelectionProps }) => {
  const setSearch = useSearchStore((state) => state.setSearch);

  const handleNavLinkClick = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      item: {
        label: string;
        to: string;
      },
    ) => {
      e.preventDefault();
      props.startTransition(() => {
        props.setTab(item.label.toLowerCase());
        setSearch('');
        window.history.pushState({}, '', item.to);
        window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      });
    },
    [props],
  );

  return (
    <>
      <Box className="mb-4">
        <Card>
          <CardActions
            classes={{
              root: styles.cardActions,
            }}
          >
            <Box
              component={'div'}
              sx={{ flexGrow: 1 }}
              className="flex gap-x-6"
            >
              {props.CardActionItems.map((item) => (
                <Tooltip key={item.label} title={item.label} placement="top">
                  <NavLink
                    to={item.to}
                    className={styles.btn}
                    onClick={(e) => {
                      handleNavLinkClick(e, item);
                    }}
                  >
                    <Box className={styles.icon}>{item.icon}</Box>
                  </NavLink>
                </Tooltip>
              ))}
            </Box>

            {!(
              excludedSearchPaths.has(props.path) ||
              excludedSearchPaths.has('/' + props.tab)
            ) && <SearchInput />}
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default Selections;
