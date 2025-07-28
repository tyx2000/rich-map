import { Editor, Element, Point, Range, Transforms } from 'slate';

export default function withChecklists(editor) {
  const { deleteBackward } = editor;
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
              mathch: (n) =>
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
  return editor;
}
