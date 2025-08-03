import { useSlate } from 'slate-react';
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
  File,
  AudioLines,
  MessageSquareText,
  Heading,
} from 'lucide-react';
import ToolButton from './toolButton';
import { createPortal } from 'react-dom';
import { useState } from 'react';

const toolMap = {
  undo: <Undo2 size={16} />,
  redo: <Redo2 size={16} />,
  divider1: <div className={styles.divider}></div>,
  header: <Heading size={16} />,
  fontSize: 'fs',
  bold: <Bold size={16} />,
  italic: <Italic size={16} />,
  underline: <Underline size={16} />,
  strikethrough: <Strikethrough size={16} />,
  code: <Code size={16} />,
  color: <Baseline size={16} />,
  highlight: <Highlighter size={16} />,
  divider2: <div className={styles.divider}></div>,
  align: <AlignLeft size={16} />,
  list: <List size={16} />,
  checklist: <ListChecks size={16} />,
  divider3: <div className={styles.divider}></div>,
  link: <Link size={16} />,
  image: <Image size={16} />,
  table: <Table size={16} />,
  video: <Film size={16} />,
  audio: <AudioLines size={16} />,
  file: <File size={16} />,
  divider4: <div className={styles.divider}></div>,
  comment: <MessageSquareText size={16} />,
};

export default function Toolbar() {
  const editor = useSlate();

  const [selectedToolName, setSelectedToolName] = useState('');

  return (
    <div
      className={styles.toolbar}
      onMouseDown={(e) => {
        // keep focus or selection in the editable
        e.preventDefault();
      }}
    >
      {Object.keys(toolMap).map((toolName, index) => (
        <ToolButton
          key={toolName + index}
          toolName={toolName}
          selectedToolName={selectedToolName}
          setSelectedToolName={(val) => setSelectedToolName(val)}
        >
          {toolMap[toolName] || toolName}
        </ToolButton>
      ))}
    </div>
  );
}
