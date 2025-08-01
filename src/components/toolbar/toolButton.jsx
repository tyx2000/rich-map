import styles from './toolButton.module.css';
import Header from './components/header';
import { useSlate } from 'slate-react';
import { Range } from 'slate';
import slateCommand from '../../../utils/slateCommand';

const optionsMap = {
  header: <Header />,
};

export default function ToolButton({ children, toolName }) {
  const editor = useSlate();

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
    if (withOptions) return;
    if (['bold', 'italic', 'underline', 'strikethrough'].includes(toolName)) {
      console.log({ toolName });
      if (editor.selection && !Range.isCollapsed(editor.selection)) {
        slateCommand.toggleMark(editor, toolName);
      }
      return;
    }
  };

  // todo click outside of the editor but not lose the selection or focus

  return (
    <div className={styles.toolButton} onClick={handleToolItemClick}>
      {children}
      {withOptions && (
        <div className={styles.options}>{optionsMap[toolName]}</div>
      )}
      {/* <div className={styles.popover}>{toolName}</div> */}
    </div>
  );
}
