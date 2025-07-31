import { useSlate } from 'slate-react';
import styles from './toolbar.module.css';
import ToolButton from './toolButton';

const tools = [
  'undo',
  'redo',
  'divider',
  'header',
  'fontSize',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  'color',
  'highlight',
  'divider',
  'align',
  'list',
  'checklist',
  'divider',
  'link',
  'image',
  'table',
  'video',
  'audio',
  'file',
  'divider',
  'comment',
  'mode',
];

export default function Toolbar() {
  const editor = useSlate();

  return (
    <div className={styles.toolbar}>
      {tools.map((toolName, index) => (
        <ToolButton key={toolName + index} name={toolName} />
      ))}
    </div>
  );
}
