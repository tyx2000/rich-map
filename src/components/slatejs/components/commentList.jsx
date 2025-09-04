import { useEffect, useRef } from 'react';
import Portal from '../../portal';
import styles from './element.module.css';
import { getSelectionOffset } from '../../../../utils/helper';

export default function CommentList({ comments }) {
  console.log('render render', comments);

  if (!comments || comments.length === 0) return null;

  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (comments && comments.length) {
      const offset = getSelectionOffset();
      el.style.opacity = '1';
      el.style.top = `${offset.top + window.pageYOffset + offset.height}px`;
      el.style.left = `${offset.left + window.pageXOffset - el.offsetWidth / 2 + offset.width / 2}px`;
    }
  }, [comments]);

  return (
    <Portal>
      <div
        ref={ref}
        className={[styles.hoveringTool, styles.commentContainer].join(' ')}
      >
        {comments.map(({ id, timestamp, username, comment, commentFor }) => {
          const datetime = new Date(timestamp);
          const [date, time] = [
            datetime.toLocaleDateString(),
            datetime.toLocaleTimeString(),
          ];
          return (
            <div key={id} className={styles.comment}>
              <div className={styles.author}>
                {username}&nbsp;&nbsp;
                <span className={styles.time}>
                  {date} {time}
                </span>
              </div>
              <div className={styles.commentFor}>{commentFor}</div>
              <div className={styles.comment}>{comment}</div>
            </div>
          );
        })}
      </div>
    </Portal>
  );
}
