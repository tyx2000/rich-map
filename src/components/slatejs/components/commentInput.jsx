import { useEffect, useRef, useState } from 'react';
import Portal from '../../portal';
import styles from './element.module.css';
import {
  getSelectionOffset,
  makeElementVisiable,
} from '../../../../utils/helper';

export default function CommentInput({ showCommentInput, onOk }) {
  const ref = useRef(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (showCommentInput) {
      const offset = getSelectionOffset();
      el.style.opacity = '1';
      el.style.top = `${offset.top + window.pageYOffset + offset.height}px`;
      el.style.left = `${offset.left + window.pageXOffset - el.offsetWidth / 2 + offset.width / 2}px`;
      makeElementVisiable(el);
      document.getElementById('commentInput').focus();
    } else {
      el.style.opacity = '0';
      el.style.top = '-10000px';
      el.style.left = '-10000px';
    }
  }, [showCommentInput]);

  return (
    <Portal>
      <div
        ref={ref}
        className={[styles.hoveringTool, styles.commentInput].join(' ')}
      >
        <input
          id="commentInput"
          type="text"
          name="comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => {
            onOk(comment);
            setComment('');
          }}
        >
          OK
        </button>
      </div>
    </Portal>
  );
}
