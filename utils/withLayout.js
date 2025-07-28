import { Editor, Element, Node, Transforms } from 'slate';

export default function withLayout(editor) {
  const { normalizeNode } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length <= 1 && Editor.string(editor, [0, 0]) === '') {
        Transforms.insertNodes(editor, {
          type: 'title',
          children: [{ text: 'Untitled' }],
        });
      }
    }

    if (editor.children.length < 2) {
      Transforms.insertNodes(
        editor,
        { type: 'paragraph', children: [{ text: '' }] },
        { at: path.concat(1) },
      );
    }

    for (const [child, childPath] of Node.children(editor, path)) {
      const slateIndex = childPath[0];
      const enforceType = (type) => {
        if (Element.isElement(child) && child.type !== type) {
          Transforms.setNodes(editor, { type }, { at: childPath });
        }
      };
      switch (slateIndex) {
        case 0:
          enforceType('title');
          break;
        case 1:
          enforceType('paragraph');
          break;
        default:
          break;
      }
    }
    return normalizeNode([node, path]);
  };
  return editor;
}
