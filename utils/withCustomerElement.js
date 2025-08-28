import { Editor, Element, Point, Range, Transforms } from 'slate';
import { insertImage, isImageUrl } from './helper';
import isUrl from 'is-url';
import slateCommand from './slateCommand';

export default function withCustomerElement(editor) {
  const {
    deleteBackward,
    deleteForward,
    insertData,
    isVoid,
    normalizeNode,
    insertBreak,
    insertText,
    isInline,
    isElementReadOnly,
    isSelectable,
  } = editor;

  editor.isInline = (element) => {
    return (
      ['link', 'button', 'badge'].includes(element.type) || isInline(element)
    );
  };

  editor.isElementReadOnly = (element) => {
    return element.type === 'badge' || isElementReadOnly(element);
  };

  editor.isSelectable = (element) => {
    return element.type !== 'badge' && isSelectable(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      slateCommand.wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    if (text && isUrl(text)) {
      slateCommand.wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  editor.isVoid = (element) => {
    return ['image', 'editableVoid', 'video'].includes(element.type)
      ? true
      : isVoid(element);
  };

  /**
   * todo
   * 回车默认会在下一行添加与上一行相同类型的元素，此时，删除 应该只是删除新添加的元素而不聚焦到上一行末尾
   * 那么，在删除时要考虑，当元素内容被删除完，再删除时，应删除整个元素并保持光标在当前行首
   */
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

      const [matchedTableCell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'table-cell',
      });
      if (matchedTableCell) {
        const [, cellPath] = matchedTableCell;
        const start = Editor.start(editor, cellPath);
        if (Point.equals(selection.anchor, start)) {
          return;
        }
      }
    }
    deleteBackward(...args);
  };

  editor.deleteForward = (...args) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [matchedTableCell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'table-cell',
      });
      if (matchedTableCell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);
        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
    }
    deleteForward(...args);
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

  // todo 通过enter跳出当前 新但是空内容 的节点 --- Shift + Enter
  editor.insertBreak = (...args) => {
    console.log('insert break');
    if (!editor.selection) return;
    const [currentNode] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n),
    });
    console.log(currentNode);
    const [element, path] = currentNode;
    if (element.type === 'code') {
      Transforms.insertText(editor, '\n');
      return;
    }

    insertBreak(...args);
  };

  return editor;
}
