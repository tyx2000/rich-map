import { Transforms } from 'slate';
import { ReactEditor, useReadOnly, useSlateStatic } from 'slate-react';

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
      style={{
        display: 'flex',
        justifyContent: alignDirection,
      }}
    >
      <span contentEditable={false} style={{ marginRight: 5 }}>
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
        style={{
          color: checked ? 'red' : 'green',
          opacity: checked ? 0.6 : 1,
          textDecoration: checked ? 'line-through' : 'none',
          outline: 'none',
        }}
      >
        {children}
      </span>
    </div>
  );
}
