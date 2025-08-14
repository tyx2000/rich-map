import styles from './options.module.css';

export default function TableSize({ onSet }) {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 5 }}
    >
      {new Array(64).fill(1).map((item, index) => (
        <div
          key={item + index}
          className={styles.tableCell}
          onClick={() => onSet('table', index)}
        >
          {index}
        </div>
      ))}
    </div>
  );
}
