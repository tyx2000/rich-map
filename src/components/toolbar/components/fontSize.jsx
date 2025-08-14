import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import styles from './options.module.css';

export default function FontSize({ onSet }) {
  const [fontSize, setFontSize] = useState(14);
  const onChangeFontSize = (type, size) => {
    if (size) {
      setFontSize(size);
      onSet('fontSize', size);
    } else {
      const newSize = type === 'minus' ? fontSize - 1 : fontSize + 1;
      const finalSize = newSize > 30 || newSize < 8 ? fontSize : newSize;
      setFontSize(finalSize);
      onSet('fontSize', finalSize);
    }
  };

  return (
    <div className={styles.fontSizeWrapper}>
      <div className={styles.minus} onClick={() => onChangeFontSize('minus')}>
        <Minus size={16}></Minus>
      </div>
      <div className={styles.input}>{fontSize}</div>
      <div className={styles.plus} onClick={() => onChangeFontSize('plus')}>
        <Plus size={16}></Plus>
      </div>
    </div>
  );
}
