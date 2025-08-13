import { Fragment } from 'react';
import styles from '../toolButton.module.css';

/**
 *
 * @param {fileType} image audio video
 * @param {onConfirm} confirm to insert
 * @returns
 */
export default function InsertFile({ fileType, onSet }) {
  const handleFromLocal = () => {
    console.log('a');
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

  const handleFromURL = () => {
    console.log('upload from url');
    onSet(fileType, 'a url');
  };

  return (
    <Fragment>
      <div className={styles.optionsItem} onClick={handleFromLocal}>
        Upload from local
      </div>
      <div className={styles.optionsItem} onClick={handleFromURL}>
        Insert via url
      </div>
    </Fragment>
  );
}
