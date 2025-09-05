import { useEffect, useRef } from 'react';
import { Editor, Range } from 'slate';
import { useFocused, useSlate } from 'slate-react';
import Toolbar from '../../toolbar/toolbar';
import Portal from '../../portal';
import styles from './element.module.css';
import {
  getSelectionOffset,
  makeElementVisiable,
} from '../../../../utils/helper';

export default function HoveringToolbar({
  showCommentInput,
  commentClickHandler,
}) {
  const ref = useRef(null);
  const editor = useSlate();
  const focused = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;
    if (!el) return;
    if (
      !selection ||
      !focused ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === '' ||
      showCommentInput
    ) {
      // el.removeAttribute('style');
      el.style.opacity = '0';
      el.style.top = '-10000px';
      el.style.left = '-10000px';
      return;
    }
    const offset = getSelectionOffset();
    el.style.opacity = '1';
    el.style.top = `${offset.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${offset.left + window.pageXOffset - el.offsetWidth / 2 + offset.width / 2}px`;

    makeElementVisiable(el);
  });

  return (
    <Portal>
      <div
        ref={ref}
        className={styles.hoveringTool}
        onMouseDown={(e) => {
          // just keep selection
          e.preventDefault();
        }}
      >
        <Toolbar hovering commentClickHandler={commentClickHandler} />
      </div>
    </Portal>
  );
}
