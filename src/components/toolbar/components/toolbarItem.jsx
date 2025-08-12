import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
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
import Divider from './divider';
import FontSize from './fontSize';
import styles from './toolbarItem.module.css';

function renderIcon(name) {
  switch (name) {
    case 'divider':
      return <Divider />;
    case 'undo':
      return <Undo2 size={16}></Undo2>;
    case 'redo':
      return <Redo2 size={16}></Redo2>;
    case 'header':
      return <Heading size={16}></Heading>;
    case 'fontSize':
      return <FontSize />;
    case 'bold':
      return <Bold size={16}></Bold>;
    case 'italic':
      return <Italic size={16}></Italic>;
    case 'underline':
      return <Underline size={16}></Underline>;
    case 'strikethrough':
      return <Strikethrough size={16}></Strikethrough>;
    case 'code':
      return <Code size={16}></Code>;
    case 'highlight':
      return <Highlighter size={16}></Highlighter>;
    case 'align':
      return <AlignLeft size={16}></AlignLeft>;
    case 'list':
      return <List size={16}></List>;
    case 'checklist':
      return <ListChecks size={16}></ListChecks>;
    case 'link':
      return <Link size={16}></Link>;
    case 'image':
      return <Image size={16}></Image>;
    case 'table':
      return <Table size={16}></Table>;
    case 'video':
      return <Film size={16}></Film>;
    case 'audio':
      return <AudioLines size={16}></AudioLines>;
    case 'file':
      return <File size={16}></File>;
    case 'comment':
      return <MessageSquareText size={16}></MessageSquareText>;
  }
}

export default function ToolbarItem({ name }) {
  return (
    <div
      className={styles.toolbarItem}
      onMouseEnter={(e) => {
        const offset = e.target.getBoundingClientRect();
        console.log({ offset });
      }}
    >
      {renderIcon(name)}
    </div>
  );
}
