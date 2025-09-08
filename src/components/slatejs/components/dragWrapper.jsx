import { useRef, useState } from 'react';
import styles from './element.module.css';
import { ReactEditor, useSlateStatic } from 'slate-react';
import DragIcon from './dragIcon';
import slateCommand from '../../../../utils/slateCommand';
import { Transforms } from 'slate';

export default function DragWrapper({
  attributes,
  children,
  style,
  elementType,
}) {
  const dragImageRef = useRef(null);
  const editor = useSlateStatic();
  const [draggable, setDraggable] = useState(false);
  const [dragStartNodePath, setDragStartNodePath] = useState('');

  const getElementPath = (e) => {
    const slateNode = ReactEditor.toSlateNode(editor, e.target);
    const slateNodePath = ReactEditor.findPath(editor, slateNode);
    return slateNodePath;
  };

  const onDragStart = (e) => {
    e.stopPropagation();
    const dragNodePath = getElementPath(e);
    e.dataTransfer.setData(
      'slate-drag-node-path',
      JSON.stringify(dragNodePath),
    );
    setDragStartNodePath(JSON.stringify(dragNodePath));
    e.dataTransfer.effectAllowed = 'move';

    // 使用currentNode获取dragNodePath可能因为被拖拽节点没有聚焦导致path错误
    // const [currentNode] = Editor.nodes(editor, {
    //   at: editor.selection,
    //   match: (n) => !Editor.isEditor(n) && Element.isElement(n),
    // });

    const dragImage = e.target.cloneNode(true);
    dragImage.style.opacity = '0.2';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-10000px';
    document.body.appendChild(dragImage);

    dragImageRef.current = dragImage;

    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const onDragOver = (e) => {
    // 阻止默认行为否则 onDrop 不触发
    e.preventDefault();
    // 设置 dropEffect 与 effectAllowed 一致，否则拖放被阻止
    e.dataTransfer.dropEffect = 'move';

    const overNodePath = getElementPath(e);
    if (JSON.stringify(overNodePath) !== dragStartNodePath) {
      e.target.style.borderBottomColor = 'purple';
    }
  };

  const onDragLeave = (e) => {
    e.target.style.borderBottomColor = 'transparent';
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (dragImageRef.current) {
      dragImageRef.current.remove();
      dragImageRef.current = null;
    }
    setDragStartNodePath('');
    e.target.style.borderBottomColor = 'transparent';
    const dragNodePath = JSON.parse(
      e.dataTransfer.getData('slate-drag-node-path'),
    );
    const dropNodePath = getElementPath(e);
    slateCommand.moveNode(editor, dragNodePath, dropNodePath);
  };

  return (
    <div
      {...attributes}
      style={style}
      className={styles.elementWrapper}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* 使用svg图标会报错警告 */}
      <DragIcon
        elementType={elementType}
        onMouseDown={() => setDraggable(true)}
      />
      {children}
    </div>
  );
}
