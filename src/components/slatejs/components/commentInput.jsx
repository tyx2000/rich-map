import { useEffect, useRef, useState } from 'react';
import Portal from '../../portal';
import styles from './element.module.css';
import {
  getSelectionOffset,
  makeElementVisiable,
} from '../../../../utils/helper';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import slateCommand from '../../../../utils/slateCommand';

export default function CommentInput({
  commentSelection,
  showCommentInput,
  onOk,
}) {
  const ref = useRef(null);
  const editor = useSlate();
  const [comment, setComment] = useState('');

  const confirmComment = () => {
    onOk(comment);
    setComment('');
  };

  const onCommentInputFocusedAndEnter = (e) => {
    if (e.key === 'Enter') {
      const el = document.activeElement;
      if (el && el.id === 'commentInput') {
        confirmComment();
      }
    }
  };

  useEffect(() => {
    if (ref.current && showCommentInput) {
      document.addEventListener('keydown', onCommentInputFocusedAndEnter);
    } else {
      document.removeEventListener('keydown', onCommentInputFocusedAndEnter);
    }
    return () => {
      document.removeEventListener('keydown', onCommentInputFocusedAndEnter);
    };
  }, [showCommentInput, comment]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (showCommentInput) {
      const offset = getSelectionOffset();
      // el.style.opacity = '1';
      el.style.top = `${offset.top + window.pageYOffset + offset.height}px`;
      el.style.left = `${offset.left + window.pageXOffset - el.offsetWidth / 2 + offset.width / 2}px`;
      makeElementVisiable(el);

      setComment('');
      document.getElementById('commentInput').focus();
    } else {
      el.style.opacity = '0';
      el.style.top = '-10000px';
      el.style.left = '-10000px';

      if (commentSelection) {
        Transforms.select(editor, commentSelection);
        slateCommand.commentAction(editor, 'check');
      }
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
