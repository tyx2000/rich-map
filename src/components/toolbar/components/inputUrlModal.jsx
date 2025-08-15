import { useState } from 'react';
import Portal from '../../portal';
import styles from './options.module.css';

export default function InputUrlModal({ fileType, onCancel, onConfirm }) {
  const [url, setUrl] = useState('');
  return (
    <Portal>
      <div className={styles.modalMask}>
        <div className={styles.modal}>
          <div>
            Here to input the{' '}
            <span
              style={{
                backgroundColor: '#eee',
                padding: '2px 5px',
                borderRadius: 3,
              }}
            >
              {fileType}
            </span>{' '}
            URL
          </div>
          <div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <button onClick={onCancel}>Cancel</button>
            <button onClick={() => onConfirm(url)}>Confirm</button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
