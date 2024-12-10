import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ path }: { path: string }) => {
  let currentTab = '';
  const crumbs = path
    .split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      crumb = crumb.replace(/%20|\s+/g, '-').toLowerCase();
      currentTab += `/${crumb}`;

      return (
        <div key={crumb} className={styles.crumb}>
          <Link to={currentTab} className="text-green-800 hover:underline">
            {crumb}
          </Link>
        </div>
      );
    });
  return <div className={styles.breadcrumbs}>{crumbs}</div>;
};

export default Breadcrumbs;
