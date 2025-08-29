import { Editor, Element, Transforms } from 'slate';
import slateCommand from './slateCommand';

export default function handleSlateKeyDown(e, editor, callback) {
  if (!editor.selection) return;
  // shift + enter 跳出当前类型节点在相邻处插入 paragraph
  if (e.shiftKey && e.key === 'Enter') {
    e.preventDefault();
    slateCommand.insertNewParagraphAtNext(editor);
    return;
  }
  // 在 code 节点中 拦截 Tab，缩进四个空格
  const [codeNode] = Editor.nodes(editor, {
    at: editor.selection,
    match: (n) => n.type === 'code',
  });
  if (codeNode && e.key === 'Tab') {
    e.preventDefault();
    Transforms.insertText(editor, '    ');
    return;
  }
  // esc 关闭选区评论框，去除临时选区标记
  if (e.key === 'Escape') {
    slateCommand.toggleComment(editor, {});
    Transforms.collapse(editor, { edge: 'end' });
    callback && callback();
  }
  // 空节点识别 / 显示 SlashMenu
  if (e.key === '/') {
    const [currentNode] = Editor.nodes(editor, {
      at: editor.selection,
      match: (n) => !Editor.isEditor(n) && Element.isElement(n),
    });
    if (currentNode) {
      const [element, path] = currentNode;
      if (
        element.children &&
        element.children.length === 1 &&
        element.children[0].text === ''
      ) {
        console.log('show slash menu');
      }
    }
  }
}
