import { Fragment } from 'react';
import styles from './options.module.css';

const headers = [
  {
    value: 'h1',
    el: <h1>h1</h1>,
  },
  {
    value: 'h2',
    el: <h2>h2</h2>,
  },
  {
    value: 'h3',
    el: <h3>h3</h3>,
  },
  {
    value: 'h4',
    el: <h4>h4</h4>,
  },
  {
    value: 'h5',
    el: <h5>h5</h5>,
  },
];

export default function Header({ onSet }) {
  return (
    <Fragment>
      {headers.map((header) => (
        <div
          key={header.value}
          className={styles.insertFileOption}
          onClick={() => onSet('header', header.value)}
        >
          {header.el}
        </div>
      ))}
    </Fragment>
  );
}
