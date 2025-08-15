import styles from './options.module.css';
import colors from '../../../constances/colors';

const colorKeys = Object.keys(colors).slice(0, 7);

export default function ColorPicker({ name, onSet }) {
  return (
    <div className={styles.colorPickerWrapper}>
      {colorKeys.map((colorKey) => (
        <div key={colorKey} className={styles.colorRow}>
          {colors[colorKey].slice(0, 8).map((color) => (
            <div
              className={styles.colorItem}
              onClick={() => onSet(name, color)}
              key={color}
              style={{
                backgroundColor: color,
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
