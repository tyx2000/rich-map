import { Fragment, useState } from 'react';
import styles from './options.module.css';

export default function TableSize({ onSet }) {
  const [size, setSize] = useState({ rows: 0, columns: 0 });
  const calcRows = (index) => Math.floor(index / 8) + 1;
  const calcColumns = (index) => (index % 8) + 1;
  return (
    <Fragment>
      <div style={{ fontSize: 13, color: 'gray', marginBottom: 10 }}>
        Insert {size.rows} x {size.columns} table
      </div>
      <div className={styles.tableWrapper}>
        {new Array(64).fill(1).map((item, index) => (
          <div
            key={item + index}
            className={styles.tableCell}
            style={{
              backgroundColor:
                calcRows(index) <= size.rows &&
                calcColumns(index) <= size.columns
                  ? '#000'
                  : '#f5f5f5',
            }}
            onClick={() => {
              onSet('table', size);
            }}
            onMouseEnter={() => {
              setSize({
                rows: calcRows(index),
                columns: calcColumns(index),
              });
            }}
            onMouseLeave={() => {
              setSize({ rows: 0, columns: 0 });
            }}
          ></div>
        ))}
      </div>
    </Fragment>
  );
}
