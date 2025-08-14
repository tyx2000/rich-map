import styles from './options.module.css';

const fontSizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

export default function FontSizeOptions({ onSet }) {
  return fontSizes.map((size) => (
    <div
      key={size}
      className={styles.fontSizeOptionsItem}
      onClick={() => onSet('fontSize', size)}
    >
      {size}
    </div>
  ));
}
