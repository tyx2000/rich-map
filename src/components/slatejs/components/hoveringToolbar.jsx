import { useEffect, useRef } from 'react';
import { Editor, Range, Text, Transforms } from 'slate';
import { useFocused, useSlate } from 'slate-react';
import slateCommand from '../../../../utils/slateCommand';
import Toolbar from '../../toolbar/toolbar';
import Portal from '../../portal';

export default function HoveringToolbar() {
  const ref = useRef(null);
  const editor = useSlate();
  const focused = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;
    if (!el) {
      return;
    }
    if (
      !selection ||
      !focused ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      // el.removeAttribute('style');
      el.style.opacity = '0';
      el.style.top = '-10000px';
      el.style.left = '-10000px';
      return;
    }
    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const offset = domRange.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${offset.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${offset.left + window.pageXOffset - el.offsetWidth / 2 + offset.width / 2}px`;
  });

  return (
    <Portal>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          zIndex: 10,
          top: -10000,
          left: -10000,
          marginTop: -6,
          opacity: 0,
          borderRadius: 4,
          transition: 'opacity linear 0.3s',
        }}
        onMouseDown={(e) => {
          // just keep selection
          e.preventDefault();
        }}
      >
        <Toolbar hovering />
      </div>
    </Portal>
  );
}
