// import { Transforms } from 'slate';
import {
  // ReactEditor,
  useFocused,
  useSelected,
  // useSlateStatic,
} from 'slate-react';
import styles from './element.module.css';

export default function ImageElement(props) {
  const { attributes, children, element } = props;
  // const editor = useSlateStatic();
  // const path = ReactEditor.findPath(editor, element);
  // Transforms.removeNodes(editor, {at: path})
  const selected = useSelected();
  const focused = useFocused();

  const alignDirection =
    { left: 'flex-start', center: 'center', right: 'flex-end' }[
      element.align
    ] || 'flex-start';

  return (
    <div {...attributes} style={{ flex: 1 }}>
      {children}

      <div
        contentEditable={false}
        className={styles.imageElement}
        style={{
          justifyContent: alignDirection,
        }}
      >
        <img
          src={element.url}
          alt={element.name}
          className={styles.imageSelf}
          style={{
            boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
          }}
        />
      </div>
    </div>
  );
}
