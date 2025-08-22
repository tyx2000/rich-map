import { useRef, useState } from 'react';
import styles from './toolbar.module.css';
import FontSize from './components/fontSize';
import InputUrlModal from './components/inputUrlModal';
import useClickOutside from '../../hooks/useClickOutside';
import slateCommand from '../../../utils/slateCommand';
import { useSlateStatic } from 'slate-react';
import {
  tools,
  hoveringTools,
  toolsWithOptions,
  toolsIconName,
  toolOptionName,
} from '../../constances/tools';

function renderIcon(name, onSet) {
  switch (name) {
    case 'divider':
      return <div className={styles.divider}></div>;
    case 'fontSize':
      return <FontSize onSet={onSet} />;
    default:
      const ToolIcon = toolsIconName[name];
      return <ToolIcon size={16} />;
  }
}

const renderOptions = (name, onSet) => {
  const OptionsComp = toolOptionName[name];
  return <OptionsComp name={name} onSet={onSet} />;
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
        slateCommand.alignNodes(editor, value);
        return;

      case 'list':
      case 'checklist':
        slateCommand.toggleList(editor, name, value);
        return;

      case 'link':
        slateCommand.insertLink(editor, 'bilibili.com');
        return;
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
