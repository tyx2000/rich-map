import { Editor, Element, Point, Range, Transforms } from 'slate';
import { insertImage, isImageUrl } from './helper';

export default function withCustomerElement(editor) {
  const { deleteBackward, insertData, isVoid, normalizeNode, insertBreak } =
    editor;

  editor.isVoid = (element) => {
    return ['image', 'editableVoid', 'video'].includes(element.type)
      ? true
      : isVoid(element);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      // 删除遇到特定类型，删除整个节点
      const [node, path] = Editor.node(editor, selection);
      const [parentNode, parentPath] = Editor.parent(editor, path);
      console.log({ node, path, parentNode, parentPath });

      const [match] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          ['checklistItem', 'listItem'].includes(n.type),
      });
      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);
        if (Point.equals(selection.anchor, start)) {
          Transforms.setNodes(
            editor,
            { type: 'paragraph' },
            {
              match: (n) =>
                !Editor.isEditor(n) &&
                Element.isElement(n) &&
                ['checklistItem', 'listItem'].includes(n.type),
            },
          );
          return;
        }
      }
    }
    deleteBackward(...args);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const { files } = data;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const [mime] = file.type.split('/');
        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            insertImage(editor, url);
          });
          reader.readAsDataURL(file);
        }
      });
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  // editor.normalizeNode = ([node, path]) => {
  //   if (path.length === 0) {
  //     if (editor.children.length <= 1 && Editor.string(editor, [0, 0]) === '') {
  //       Transforms.insertNodes(editor, {
  //         type: 'title',
  //         children: [{ text: 'Untitled' }],
  //       });
  //     }
  //   }

  //   if (editor.children.length < 2) {
  //     Transforms.insertNodes(
  //       editor,
  //       { type: 'paragraph', children: [{ text: '' }] },
  //       { at: path.concat(1) },
  //     );
  //   }

  //   for (const [child, childPath] of Node.children(editor, path)) {
  //     const slateIndex = childPath[0];
  //     const enforceType = (type) => {
  //       if (Element.isElement(child) && child.type !== type) {
  //         Transforms.setNodes(editor, { type }, { at: childPath });
  //       }
  //     };
  //     switch (slateIndex) {
  //       case 0:
  //         enforceType('title');
  //         break;
  //       case 1:
  //         enforceType('paragraph');
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  //   return normalizeNode([node, path]);
  // };

  editor.insertBreak = (...args) => {
    const [nodes] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'listItem',
    });
    console.log({ nodes });

    insertBreak(...args);
  };

  return editor;
}
