import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Fragment } from 'react';
import styles from '../toolButton.module.css';

const aligns = [
  { value: 'left', el: <AlignLeft size={18} /> },
  { value: 'center', el: <AlignCenter size={18} /> },
  { value: 'right', el: <AlignRight size={18} /> },
];

export default function AlignItems({ onSet }) {
  return (
    <Fragment>
      {aligns.map((item) => (
        <div
          key={item.value}
          className={styles.optionsItem}
          onClick={() => onSet('align', item.value)}
        >
          {item.el}
        </div>
      ))}
    </Fragment>
  );
}
