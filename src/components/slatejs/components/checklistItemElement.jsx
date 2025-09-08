import { Transforms } from 'slate';
import { ReactEditor, useReadOnly, useSlateStatic } from 'slate-react';
import styles from './element.module.css';

export default function ChecklistItemElement(props) {
  const { attributes, children, element } = props;
  const { checked } = element;
  const editor = useSlateStatic();
  const readonly = useReadOnly();

  const alignDirection =
    { left: 'flex-start', center: 'center', right: 'flex-right' }[
      element.align
    ] || 'flex-start';

  return (
    <div
      {...attributes}
      style={{ justifyContent: alignDirection }}
      className={styles.checkListItem}
    >
      <span contentEditable={false} className={styles.checkBox}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            const path = ReactEditor.findPath(editor, element);
            Transforms.setNodes(
              editor,
              { checked: event.target.checked },
              { at: path },
            );
          }}
        />
      </span>
      <span
        contentEditable={!readonly}
        suppressContentEditableWarning
        className={styles.checkContent}
        style={{
          color: checked ? 'red' : '#000',
          opacity: checked ? 0.6 : 1,
          textDecoration: checked ? 'line-through' : 'none',
        }}
      >
        {children}
      </span>
    </div>
  );
}
