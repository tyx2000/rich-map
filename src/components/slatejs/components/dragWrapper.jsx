import { useState } from 'react';
import styles from './element.module.css';
import { GripVertical } from 'lucide-react';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { Editor, Element } from 'slate';

export default function DragWrapper({ attributes, children, style }) {
  const editor = useSlateStatic();
  const [draggable, setDraggable] = useState(false);

  const onDragStart = (e) => {
    e.stopPropagation();
    const [currentNode] = Editor.nodes(editor, {
      at: editor.selection,
      match: (n) => !Editor.isEditor(n) && Element.isElement(n),
    });
    console.log(currentNode);
    if (currentNode) {
      const [, path] = currentNode;
      e.dataTransfer.setData('slate-drag-node-path', path[0] + '');
      e.dataTransfer.effectAllowed = 'move';

      // const dragImage = e.target.cloneNode(true);
      // dragImage.style.opacity = '0.1';
      // dragImage.style.position = 'absolute';
      // dragImage.style.top = '-10000px';
      // document.body.appendChild(dragImage);

      // e.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  };

  const onDragOver = (e) => {
    // 阻止默认行为否则 onDrop 不触发
    e.preventDefault();
    // 设置 dropEffect 与 effectAllowed 一致，否则拖放被阻止
    e.dataTransfer.dropEffect = 'move';
    e.target.style.borderColor = 'purple';
  };

  const onDragLeave = (e) => {
    e.target.style.borderColor = 'transparent';
  };

  const onDragEnd = (e) => {};

  const onDrop = (e) => {
    e.preventDefault();
    const dragNodePath = e.dataTransfer.getData('slate-drag-node-path');
    console.log('drop', { dragNodePath });
    const targetSlateNode = ReactEditor.toSlateNode(editor, e.target);
    const targetPath = ReactEditor.findPath(editor, targetSlateNode);
    console.log({ targetPath });
  };

  // type exchange or insertBelow
  const settleNodes = (dragNodePath, targetNodePath, type) => {};

  return (
    <div
      {...attributes}
      style={style}
      className={styles.elementWrapper}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
      <GripVertical
        size={16}
        color="#737373"
        className={styles.dragIcon}
        onMouseDown={() => setDraggable(true)}
      />
      {children}
    </div>
  );
}
