import { Editor, Element, Range, Transforms } from 'slate';

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
  toggleMark(editor, format) {
    const marks = Editor.marks(editor);
    const isActive = marks ? !!marks[format] : false;
    console.log({ marks });
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, format === 'bgc' ? 'yellow' : true);
    }
  },
};

export default slateCommand;
