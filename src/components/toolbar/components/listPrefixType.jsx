import { Fragment } from 'react';
import styles from './options.module.css';

const prefixs = [
  {
    label: (
      <div className={styles.listPrefixLabel}>
        <div className={styles.typeIcon}></div>
        <div>Default</div>
      </div>
    ),
    value: 'default',
  },
  {
    label: (
      <div className={styles.listPrefixLabel}>
        <div
          className={styles.typeIcon}
          style={{
            backgroundColor: '#fff',
          }}
        ></div>
        <div>Circle</div>
      </div>
    ),
    value: 'circle',
  },
  {
    label: (
      <div className={styles.listPrefixLabel}>
        <div
          className={styles.typeIcon}
          style={{
            borderRadius: 0,
          }}
        ></div>
        <div>Square</div>
      </div>
    ),
    value: 'square',
  },
  {
    label: <div style={{ width: '100%' }}>Decimal(1, 2, 3)</div>,
    value: 'decimal',
  },
  {
    label: <div style={{ width: '100%' }}>Lower Alpha(a, b, c)</div>,
    value: 'lowerAlpha',
  },
];

export default function ListPrefixType({ onSet }) {
  return (
    <Fragment>
      {prefixs.map((item) => (
        <div
          key={item.value}
          className={styles.listPrefixItem}
          style={{
            fontSize: 13,
            width: 130,
          }}
          onClick={() => onSet('list', item.value)}
        >
          {item.label}
        </div>
      ))}
    </Fragment>
  );
}
