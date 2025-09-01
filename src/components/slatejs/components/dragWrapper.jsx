import { useState } from 'react';
import styles from './element.module.css';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { Editor, Element } from 'slate';
import DragIcon from './dragIcon';
import slateCommand from '../../../../utils/slateCommand';

export default function DragWrapper({ attributes, children, style }) {
  const editor = useSlateStatic();
  const [draggable, setDraggable] = useState(false);

  const onDragStart = (e) => {
    e.stopPropagation();
    const dragSlateNode = ReactEditor.toSlateNode(editor, e.target);
    const dragNodePath = ReactEditor.findPath(editor, dragSlateNode);
    e.dataTransfer.setData(
      'slate-drag-node-path',
      JSON.stringify(dragNodePath),
    );
    e.dataTransfer.effectAllowed = 'move';

    // 使用currentNode获取dragNodePath可能因为被拖拽节点没有聚焦导致path错误
    // const [currentNode] = Editor.nodes(editor, {
    //   at: editor.selection,
    //   match: (n) => !Editor.isEditor(n) && Element.isElement(n),
    // });

    // const dragImage = e.target.cloneNode(true);
    // dragImage.style.opacity = '0.1';
    // dragImage.style.position = 'absolute';
    // dragImage.style.top = '-10000px';
    // document.body.appendChild(dragImage);

    // e.dataTransfer.setDragImage(dragImage, 0, 0);
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
    e.target.style.borderColor = 'transparent';
    const dragNodePath = JSON.parse(
      e.dataTransfer.getData('slate-drag-node-path'),
    );
    const dropSlateNode = ReactEditor.toSlateNode(editor, e.target);
    const dropNodePath = ReactEditor.findPath(editor, dropSlateNode);
    console.log({ dragNodePath, dropNodePath });
    slateCommand.moveNode(editor, dragNodePath, dropNodePath);
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
      {/* 使用svg图标会报错警告 */}
      <DragIcon onMouseDown={() => setDraggable(true)} />
      {children}
    </div>
  );
}
