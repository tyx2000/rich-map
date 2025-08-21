import { useRef, useState } from 'react';
import styles from './toolbar.module.css';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Baseline,
  Highlighter,
  AlignLeft,
  List,
  ListChecks,
  Link,
  Image,
  Table,
  Film,
  FileText,
  AudioLines,
  MessageSquareText,
  Heading,
} from 'lucide-react';
import FontSize from './components/fontSize';
import FontSizeOptions from './components/fontSizeOptions';
import AlignItems from './components/alignItems';
import ColorPicker from './components/colorPicker';
import Header from './components/header';
import InsertFile from './components/insertFile';
import ListPrefixType from './components/listPrefixType';
import TableSize from './components/tableSize';
import InputUrlModal from './components/inputUrlModal';
import useClickOutside from '../../hooks/useClickOutside';
import slateCommand from '../../../utils/slateCommand';
import { useSlateStatic } from 'slate-react';
import { tools, hoveringTools, toolsWithOptions } from '../../constances/tools';

function renderIcon(name, onSet) {
  switch (name) {
    case 'divider':
      return <div className={styles.divider}></div>;
    case 'undo':
      return <Undo2 size={16} />;
    case 'redo':
      return <Redo2 size={16} />;
    case 'header':
      return <Heading size={16} />;
    case 'fontSize':
      return <FontSize onSet={onSet} />;
    case 'bold':
      return <Bold size={16} />;
    case 'italic':
      return <Italic size={16} />;
    case 'underline':
      return <Underline size={16} />;
    case 'strikethrough':
      return <Strikethrough size={16} />;
    case 'code':
      return <Code size={16} />;
    case 'color':
      return <Baseline size={16} />;
    case 'highlight':
      return <Highlighter size={16} />;
    case 'align':
      return <AlignLeft size={16} />;
    case 'list':
      return <List size={16} />;
    case 'checklist':
      return <ListChecks size={16} />;
    case 'link':
      return <Link size={16} />;
    case 'image':
      return <Image size={16} />;
    case 'table':
      return <Table size={16} />;
    case 'video':
      return <Film size={16} />;
    case 'audio':
      return <AudioLines size={16} />;
    case 'file':
      return <FileText size={16} />;
    case 'comment':
      return <MessageSquareText size={16} />;
  }
}

const renderOptions = (name, onSet) => {
  switch (name) {
    case 'header':
      return <Header onSet={onSet} />;
    case 'fontSize':
      return <FontSizeOptions onSet={onSet} />;
    case 'color':
      return <ColorPicker name="color" onSet={onSet} />;
    case 'highlight':
      return <ColorPicker name="highlight" onSet={onSet} />;
    case 'align':
      return <AlignItems onSet={onSet} />;
    case 'list':
      return <ListPrefixType onSet={onSet} />;
    case 'image':
      return <InsertFile fileType="image" onSet={onSet} />;
    case 'table':
      return <TableSize onSet={onSet} />;
    case 'video':
      return <InsertFile fileType="video" onSet={onSet} />;
    case 'audio':
      return <InsertFile fileType="audio" onSet={onSet} />;
    case 'file':
      return <InsertFile fileType="file" onSet={onSet} />;
  }
};

export default function Toolbar({ hovering }) {
  const editor = useSlateStatic();
  const toolbarRef = useRef(null);
  const [selectedToolName, setSelectedToolName] = useState('');
  const [optionsOffsetLeft, setOptionsOffsetLeft] = useState(0);
  const [inputUrlFileType, setInputUrlFileType] = useState(false);

  useClickOutside(toolbarRef, () => {
    setSelectedToolName('');
  });

  const onClickToolItem = (e, name) => {
    if (toolsWithOptions.includes(name)) {
      setSelectedToolName(name);
      const childEl = e.currentTarget;
      const parentEl = childEl.parentNode;
      const childOffset = childEl.getBoundingClientRect();
      const parentOffset = parentEl.getBoundingClientRect();
      setOptionsOffsetLeft(childOffset.left - parentOffset.left);
    } else {
      onSet(name);
    }
  };

  const onSet = (name, value) => {
    setSelectedToolName('');
    console.log(name, value);
    switch (name) {
      case 'undo':
      case 'redo':
        slateCommand.undoOrRedo(editor, name);
        return;

      case 'header':
        slateCommand.toggleHeader(editor, value);
        return;

      case 'fontSize':
        slateCommand.toggleMark(editor, 'fontSize', value);
        return;

      case 'bold':
      case 'italic':
      case 'underline':
      case 'strikethrough':
        slateCommand.toggleMark(editor, name, true);
        return;

      case 'code':
        slateCommand.toggleCodeBlock(editor);
        return;

      case 'color':
      case 'highlight':
        slateCommand.toggleMark(editor, name, value);
        return;

      case 'align':
        slateCommand.toggleMark(editor, 'align', value);
        return;

      case 'list':
      case 'checklist':
      case 'link':
      case 'table':
        // todo
        return;

      case 'image':
      case 'audio':
      case 'video':
      case 'file':
        if (value === 'upload-via-url') {
          setInputUrlFileType(name);
        } else {
          insertFile(name, value);
        }
        return;

      case 'comment':
        return;
    }
  };

  const insertFile = (fileType, value) => {
    console.log(fileType, value);
  };

  return (
    <div
      ref={toolbarRef}
      className={styles.toolbar}
      onMouseDown={(e) => {
        // keep focus or selection in the editable
        if (!inputUrlFileType) {
          e.preventDefault();
        }
      }}
    >
      {(hovering ? hoveringTools : tools).map((item, index) => (
        <div
          className={styles.toolbarItem}
          key={item + index}
          onClick={(e) => onClickToolItem(e, item)}
        >
          {renderIcon(item, onSet)}
          {item !== 'divider' && item !== selectedToolName && (
            <div
              style={{ top: hovering ? -35 : 35 }}
              className={styles.popover}
            >
              {item}
            </div>
          )}
        </div>
      ))}
      {toolsWithOptions.includes(selectedToolName) && (
        <div
          className={styles.options}
          style={{
            left: optionsOffsetLeft,
            opacity: +!!selectedToolName,
          }}
        >
          {renderOptions(selectedToolName, onSet)}
        </div>
      )}
      {inputUrlFileType && (
        <InputUrlModal
          fileType={inputUrlFileType}
          onConfirm={(url) => {
            insertFile(inputUrlFileType, url);
            setInputUrlFileType(false);
          }}
          onCancel={() => setInputUrlFileType(false)}
        />
      )}
    </div>
  );
}
