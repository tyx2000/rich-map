import { Heading } from 'lucide-react';
import { Fragment } from 'react';
import styles from './header.module.css';

export default function Header() {
  return (
    <Fragment>
      <Heading size={16} />
      <div className={styles.options}>
        <div className={styles.optionsItem}>
          <h1>h1</h1>
        </div>
        <div className={styles.optionsItem}>
          <h2>h2</h2>
        </div>
        <div className={styles.optionsItem}>
          <h3>h3</h3>
        </div>
        <div className={styles.optionsItem}>
          <h4>h4</h4>
        </div>
        <div className={styles.optionsItem}>
          <h5>h5</h5>
        </div>
      </div>
    </Fragment>
  );
}
