import { Fragment } from 'react';
import styles from '../toolButton.module.css';

/**
 *
 * @param {fileType} image audio video
 * @param {onConfirm} confirm to insert
 * @returns
 */
export default function InsertFile({ fileType, onConfirm }) {
  const handleFromLocal = () => {
    console.log('a');
    const el = document.createElement('input');
    el.type = 'file';
    el.style.opacity = '0';
    el.onchange = (e) => {
      console.log('files', e.target.files);
      // filter file according to fileType
      const fileUrl = 'https://i.imgur.com/VZewSe2.jpeg';
      onConfirm(fileUrl);
    };
    el.oncancel = () => {
      console.log('cancel');
      el.remove();
    };
    el.onerror = () => {
      el.remove();
    };
    document.body.appendChild(el);
    el.click();
  };

  const handleFromURL = () => {};

  return (
    <Fragment>
      <div
        className={styles.optionsItem}
        style={{ fontSize: 12 }}
        onClick={handleFromLocal}
      >
        Choose Local File
      </div>
      <div className={styles.optionsItem}>
        <input
          type="text"
          placeholder="From URL"
          style={{
            height: 24,
            borderRadius: 6,
            border: '2px solid #f5f5f5',
            outline: 'none',
            fontSize: 12,
          }}
        />
        <button
          onClick={handleFromURL}
          style={{
            background: '#f4f4f4',
            border: 'none',
            borderRadius: 5,
            marginLeft: 8,
            padding: '2px 8px',
          }}
        >
          OK
        </button>
      </div>
    </Fragment>
  );
}
