import { Transforms } from 'slate';
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react';

export default function ImageElement(props) {
  const { attributes, children, element } = props;
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}

      <div contentEditable={false} style={{ position: 'relative' }}>
        <img
          src={element.url}
          alt={element.name}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '20em',
            boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
          }}
        />
        <button
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          style={{
            display: selected && focused ? 'inline' : 'none',
            position: 'absolute',
            top: '0.5em',
            left: '0.5em',
            backgroundColor: '#fff',
          }}
        >
          delete
        </button>
      </div>
    </div>
  );
}
