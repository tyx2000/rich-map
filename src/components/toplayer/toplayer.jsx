import styles from './toplayer.module.css';
import { Outlet } from 'react-router';

export default function TopLayer() {
  return (
    <div className={styles.toplayer}>
      <Outlet />
    </div>
  );
}
