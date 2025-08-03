import styles from './toolButton.module.css';
import Header from './components/header';
import { useSlate } from 'slate-react';
import { Range } from 'slate';
import slateCommand from '../../../utils/slateCommand';
import { useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';

const renderOptions = (toolName, onSetFormat) => {
  const optionsMap = {
    header: <Header onSetFormat={onSetFormat} />,
  };

  return optionsMap[toolName] || toolName;
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
    setSelectedToolName('');
    if (['header', 'fontStyle'].includes(toolName)) {
      if (editor.selection && !Range.isCollapsed(editor.selection)) {
        slateCommand.toggleMark(editor, value);
      }
    }
  };

  // todo click outside of the editor but not lose the selection or focus

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
