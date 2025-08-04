import styles from './toolButton.module.css';
import Header from './components/header';
import { useSlate } from 'slate-react';
import { Editor, Range, Transforms } from 'slate';
import slateCommand from '../../../utils/slateCommand';
import { useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import ColorPicker from './components/colorPicker';
import AlignItems from './components/alignItems';

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
      console.log(editor.selection);

      let targetNodes;
      if (Range.isCollapsed(editor.selection)) {
        const [node] = Editor.nodes(editor, {
          mode: 'highest',
        });
        targetNodes = node ? [node] : [];
      } else {
        targetNodes = Array.from(
          Editor.nodes(editor, {
            match: (n) => ['paragraph', 'image'].includes(n.type),
            mode: 'highest',
          }),
        );
      }
      targetNodes.forEach(([node, path]) => {
        Transforms.setNodes(
          editor,
          {
            align: value,
          },
          { at: path },
        );
      });
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
