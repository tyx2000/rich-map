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
        padding: '3px 0',
      }}
    >
      <span
        contentEditable={false}
        style={{ width: 26, display: 'flex', alignItems: 'center' }}
      >
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
          color: checked ? 'red' : '#000',
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
