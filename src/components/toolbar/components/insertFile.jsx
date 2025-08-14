import { Fragment } from 'react';
import styles from './options.module.css';

/**
 *
 * @param {fileType} image audio video
 * @param {onConfirm} confirm to insert
 * @returns
 */
export default function InsertFile({ fileType, onSet }) {
  const handleFromLocal = () => {
    const el = document.createElement('input');
    el.type = 'file';
    el.style.opacity = '0';
    el.onchange = (e) => {
      console.log('files', e.target.files);
      // filter file according to fileType
      const fileUrl = 'https://i.imgur.com/VZewSe2.jpeg';
      onSet(fileType, fileUrl);
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

  return (
    <Fragment>
      <div className={styles.insertFileOption} onClick={handleFromLocal}>
        Upload from local
      </div>
      <div
        className={styles.insertFileOption}
        onClick={() => onSet(fileType, 'upload-via-url')}
      >
        Insert via url
      </div>
    </Fragment>
  );
}
