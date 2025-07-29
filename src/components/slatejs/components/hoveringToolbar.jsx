import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Editor, Range } from 'slate';
import { useFocused, useSlate } from 'slate-react';
import slateCommand from '../../../../utils/slateCommand';

function Portal({ children }) {
  return typeof document === 'object'
    ? createPortal(children, document.body)
    : null;
}

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
      el.style.top = -10000;
      el.style.left = -10000;
      return;
    }
    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const offset = domRange.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${offset.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${offset.left + window.pageXOffset - el.offsetWidth / 2 + offset.width / 2}px`;
  });

  const handleFontMark = (format) => {
    slateCommand.toggleMark(editor, format);
  };

  return (
    <Portal>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          zIndex: 1,
          top: -10000,
          left: -10000,
          marginTop: -6,
          opacity: 0,
          borderRadius: 4,
          transition: 'opacity 0.2s',
        }}
      >
        {['bold', 'italic', 'del', 'underline', 'bgc'].map((item) => (
          <button key={item} onClick={() => handleFontMark(item)}>
            {item}
          </button>
        ))}
      </div>
    </Portal>
  );
}
