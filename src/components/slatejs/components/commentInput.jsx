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

  const confirmComment = () => {
    onOk(comment);
    setComment('');
  };

  const onCommentInputFocusedAndEnter = (e) => {
    if (e.key === 'Enter') {
      const el = document.activeElement;
      if (el && el.id === 'commentInput') {
        // todo 可以执行，但是选区变化，无法把评论添加到正确的选区上
        // confirmComment();
      }
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (showCommentInput) {
      const offset = getSelectionOffset();
      el.style.opacity = '1';
      el.style.top = `${offset.top + window.pageYOffset + offset.height}px`;
      el.style.left = `${offset.left + window.pageXOffset - el.offsetWidth / 2 + offset.width / 2}px`;
      makeElementVisiable(el);

      setComment('');
      document.getElementById('commentInput').focus();

      document.addEventListener('keydown', onCommentInputFocusedAndEnter);
    } else {
      el.style.opacity = '0';
      el.style.top = '-10000px';
      el.style.left = '-10000px';
      document.removeEventListener('keydown', onCommentInputFocusedAndEnter);
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
        <button type="button" onClick={confirmComment}>
          OK
        </button>
      </div>
    </Portal>
  );
}
