import styles from './toolButton.module.css';
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
  File,
  AudioLines,
  MessageSquareText,
} from 'lucide-react';
import Header from './components/header';

const toolMap = {
  divider: <div className={styles.divider}></div>,
  undo: <Undo2 size={16} />,
  redo: <Redo2 size={16} />,
  header: <Header size={16} />,
  fontSize: 'fs',
  bold: <Bold size={16} />,
  italic: <Italic size={16} />,
  underline: <Underline size={16} />,
  strikethrough: <Strikethrough size={16} />,
  code: <Code size={16} />,
  color: <Baseline size={16} />,
  highlight: <Highlighter size={16} />,
  align: <AlignLeft size={16} />,
  list: <List size={16} />,
  checklist: <ListChecks size={16} />,
  link: <Link size={16} />,
  image: <Image size={16} />,
  table: <Table size={16} />,
  video: <Film size={16} />,
  audio: <AudioLines size={16} />,
  file: <File size={16} />,
  comment: <MessageSquareText size={16} />,
};

export default function ToolButton({ name }) {
  return (
    <div className={styles.toolButton}>
      {toolMap[name] || name}
      <div className={styles.popover}>{name}</div>
    </div>
  );
}
