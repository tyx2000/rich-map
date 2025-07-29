import isUrl from 'is-url';
import slateCommand from './slateCommand';

export default function withInlines(editor) {
  const { insertData, insertText, isInline, isElementReadOnly, isSelectable } =
    editor;

  editor.isInline = (element) =>
    ['link', 'button', 'badge'].includes(element.type) || isInline(element);

  editor.isElementReadOnly = (element) =>
    element.type === 'badge' || isElementReadOnly(element);

  editor.isSelectable = (element) =>
    element.type !== 'badge' && isSelectable(element);

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

  return editor;
}
