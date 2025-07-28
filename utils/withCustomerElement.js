import { Editor, Element, Point, Range, Transforms } from 'slate';
import { insertImage, isImageUrl } from './helper';

export default function withCustomerElement(editor) {
  const { deleteBackward, insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return ['image', 'editableVoid', 'video'].includes(element.type)
      ? true
      : isVoid(element);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'checklistItem',
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
                n.type === 'checklistItem',
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

  return editor;
}
