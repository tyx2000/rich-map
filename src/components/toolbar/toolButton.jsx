import styles from './toolButton.module.css';
import Header from './components/header';
import { useSlate } from 'slate-react';
import { Editor, Range, Transforms } from 'slate';
import slateCommand from '../../../utils/slateCommand';
import { useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import ColorPicker from './components/colorPicker';
import AlignItems from './components/alignItems';
import ListPrefixType from './components/listPrefixType';
import InsertFile from './components/insertFile';
import TableSize from './components/tableSize';

const renderOptions = (toolName, onSetFormat) => {
  const optionsMap = {
    header: <Header onSetFormat={onSetFormat} />,
    color: (
      <ColorPicker onSetFormat={(color) => onSetFormat(toolName, color)} />
    ),
    highlight: (
      <ColorPicker onSetFormat={(color) => onSetFormat(toolName, color)} />
    ),
    align: <AlignItems onSetFormat={onSetFormat} />,
    table: <TableSize onSetFormat={(index) => onSetFormat('table', index)} />,
    list: <ListPrefixType onAddList={(type) => onSetFormat(toolName, type)} />,
    image: <InsertFile fileType={toolName} onConfirm={onSetFormat} />,
    audio: <InsertFile fileType={toolName} onConfirm={onSetFormat} />,
    video: <InsertFile fileType={toolName} onConfirm={onSetFormat} />,
    file: <InsertFile fileType={toolName} onConfirm={onSetFormat} />,
  };

  return optionsMap[toolName] || '';
};

export default function ToolButton({
  children,
  toolName,
  selectedToolName,
  setSelectedToolName,
}) {
  const editor = useSlate();
  const toolOptionsRef = useRef(null);

  useClickOutside(toolOptionsRef, () => {
    if (toolOptionsRef.current && selectedToolName === toolName) {
      // setSelectedToolName('');
      console.log('sssssssss');
    }
  });

  const withOptions = [
    'header',
    'fontSize',
    'color',
    'highlight',
    'align',
    'list',
    'link',
    'image',
    'table',
    'video',
    'audio',
    'file',
  ].includes(toolName);

  const handleToolItemClick = () => {
    setSelectedToolName(toolName);
    if (!withOptions) {
      if (['bold', 'italic', 'underline', 'strikethrough'].includes(toolName)) {
        onSetFormat('fontStyle', toolName);
      }
      if (toolName === 'checklist') {
        Transforms.insertNodes(
          editor,
          {
            type: 'checklistItem',
            children: [{ text: '' }],
          },
          {
            at: editor.selection.path,
          },
        );
      }
    }
  };

  const onSetFormat = (toolName, value) => {
    console.log({ toolName, value });
    setTimeout(() => {
      setSelectedToolName('');
    }, 30);
    if (['header', 'fontStyle', 'color', 'highlight'].includes(toolName)) {
      if (editor.selection && !Range.isCollapsed(editor.selection)) {
        slateCommand.toggleMark(editor, toolName, value);
      }
    }
    if (toolName === 'align') {
      if (!editor.selection) return;

      Transforms.setNodes(
        editor,
        { align: value },
        { at: editor.selection.path },
      );
    }

    if (toolName === 'list') {
      if (!editor.selection) return;
      Transforms.insertNodes(
        editor,
        {
          type: 'listItem',
          prefix: value,
          children: [{ text: '' }],
        },
        { at: editor.selection.path },
      );
    }

    if (['image', 'audio', 'video'].includes(toolName)) {
      Transforms.insertNodes(
        editor,
        {
          type: toolName,
          url: value,
          name: 'media source',
          children: [{ text: '' }],
        },
        {
          at: editor.selection.path, // || Editor.end(),
        },
      );
    }

    if (toolName === 'table') {
      console.log('row column', value, Math.ceil(value / 8), (value % 8) + 1);
    }
  };

  // todo click outside of the editor but not lose the selection or focus
  // just e.preventDefault() :)

  return (
    <div className={styles.toolButton} onClick={handleToolItemClick}>
      {children}
      {withOptions && (
        <div
          ref={toolOptionsRef}
          className={[
            styles.options,
            toolName === selectedToolName ? styles.showOptions : '',
          ].join(' ')}
        >
          {renderOptions(toolName, onSetFormat)}
        </div>
      )}
      <div className={styles.popover}>{toolName}</div>
    </div>
  );
}
