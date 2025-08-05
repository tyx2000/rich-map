import { Fragment } from 'react';
import styles from '../toolButton.module.css';

const prefixs = [
  {
    label: (
      <div
        style={{
          width: '100%',
          display: 'flex',
          gap: 5,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#000',
          }}
        ></div>
        <div>Default</div>
      </div>
    ),
    value: 'default',
  },
  {
    label: (
      <div
        style={{
          display: 'flex',
          width: '100%',
          gap: 5,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            border: '1px solid #000',
          }}
        ></div>
        <div>Circle</div>
      </div>
    ),
    value: 'circle',
  },
  {
    label: (
      <div
        style={{
          display: 'flex',
          width: '100%',
          gap: 5,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            backgroundColor: '#000',
          }}
        ></div>
        <div>Default</div>
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

export default function ListPrefixType({ onAddList }) {
  return (
    <Fragment>
      {prefixs.map((item) => (
        <div
          key={item.value}
          className={styles.optionsItem}
          style={{
            fontSize: 13,
            width: 130,
          }}
          onClick={() => onAddList(item.value)}
        >
          {item.label}
        </div>
      ))}
    </Fragment>
  );
}
