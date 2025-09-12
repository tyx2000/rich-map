import { ReactEditor, useSlate } from 'slate-react';

export default function CommentElement({ attributes, element, children }) {
  const editor = useSlate();
  const commentNodePath = ReactEditor.findPath(editor, element);
  console.log(commentNodePath, element.nodeId);

  const clickCommentHandler = (e) => {
    e.stopPropagation();
    // Transforms.select(editor, nodePath);
    // const [node] = Editor.nodes(editor, {
    //   at: nodePath,
    // });
    // console.log('====>', nodePath, node);
  };

  return (
    <span
      {...attributes}
      style={{
        borderBottom: element.borderBottom,
        backgroundColor: element.backgroundColor || '',
      }}
      onClick={clickCommentHandler}
    >
      {children}
    </span>
  );
}
