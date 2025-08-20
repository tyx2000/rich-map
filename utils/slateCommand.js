import { Editor, Element, Range, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';

const slateCommand = {
  isLinkActive(editor) {
    const [link] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
    return !!link;
  },
  isButtonActive(editor) {
    const [button] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'button',
    });
    return !!button;
  },
  wrapLink(editor, url) {
    if (this.isLinkActive(editor)) {
      this.unwrapLink(editor);
    }
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link = {
      type: 'link',
      url,
      children: isCollapsed ? [{ text: url }] : [],
    };
    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  },
  unwrapLink(editor) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
  },
  wrapButton(editor) {
    if (this.isButtonActive(editor)) {
      this.unwrapButton(editor);
    }
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const button = {
      type: 'button',
      children: isCollapsed ? [{ text: 'edit me' }] : [],
    };
    if (isCollapsed) {
      Transforms.insertNodes(editor, button);
    } else {
      Transforms.wrapNodes(editor, button, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  },
  unwrapButton(editor) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'button',
    });
  },
  insertLink(editor, url) {
    if (editor.selection) {
      this.wrapLink(editor, url);
    }
  },
  insertButton(editor) {
    if (editor.selection) {
      this.wrapButton(editor);
    }
  },
  isBoldMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },
  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'code',
    });
    return !!match;
  },
  toggleBoldMark(editor) {
    const isActive = this.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },
  toggleCodeBlock(editor) {
    const isActive = this.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) },
    );
  },
  undoOrRedo(editor, action) {
    const isHistoryEditor = HistoryEditor.isHistoryEditor(editor);
    if (isHistoryEditor) {
      const { undos, redos } = editor.history;
      if (action === 'undo' && undos.length > 0) {
        editor.undo();
      }
      if (action === 'redo' && redos.length > 0) {
        editor.redo();
      }
    }
  },
  toggleHeader(editor, value) {
    console.log(value, editor.selection);
    if (!editor.selection) return;
    const { anchor, focus } = editor.selection;
    const start = Range.start(editor.selection),
      end = Range.end(editor.selection);
    const [startMatchNode] = Editor.nodes(editor, {
      at: start.path,
      match: (n) => Editor.isBlock(editor, n),
      mode: 'highest',
    });
    const [endMatchNode] = Editor.nodes(editor, {
      at: end.path,
      match: (n) => Editor.isBlock(editor, n),
      mode: 'highest',
    });

    if (!startMatchNode || !endMatchNode) return;

    const startIndex = startMatchNode[1][0],
      endIndex = endMatchNode[1][0];

    console.log(startIndex, endIndex, { startMatchNode, endMatchNode });
  },
  toggleMark(editor, formatLabel, formatValue) {
    const marks = Editor.marks(editor);
    const isActive = marks ? marks[formatLabel] === formatValue : false;
    if (isActive) {
      Editor.removeMark(editor, formatLabel);
    } else {
      Editor.addMark(editor, formatLabel, formatValue);
    }
  },
};

export default slateCommand;
