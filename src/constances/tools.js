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
import Header from '../components/toolbar/components/header';
import FontSizeOptions from '../components/toolbar/components/fontSizeOptions';
import ColorPicker from '../components/toolbar/components/colorPicker';
import AlignItems from '../components/toolbar/components/alignItems';
import ListPrefixType from '../components/toolbar/components/listPrefixType';
import TableSize from '../components/toolbar/components/tableSize';
import InsertFile from '../components/toolbar/components/insertFile';

export const toolsIconName = {
  undo: Undo2,
  redo: Redo2,
  header: Heading,
  bold: Bold,
  italic: Italic,
  underline: Underline,
  strikethrough: Strikethrough,
  color: Baseline,
  highlight: Highlighter,
  code: Code,
  align: AlignLeft,
  list: List,
  checklist: ListChecks,
  link: Link,
  image: Image,
  table: Table,
  video: Film,
  audio: AudioLines,
  file: FileText,
  comment: MessageSquareText,
};

export const toolOptionName = {
  header: Header,
  fontSize: FontSizeOptions,
  color: ColorPicker,
  highlight: ColorPicker,
  align: AlignItems,
  list: ListPrefixType,
  table: TableSize,
  image: InsertFile,
  video: InsertFile,
  audio: InsertFile,
  file: InsertFile,
};

export const tools = [
  'undo',
  'redo',
  'divider',
  'header',
  'fontSize',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'color',
  'highlight',
  'code',
  'divider',
  'align',
  'list',
  'checklist',
  'table',
  'divider',
  'link',
  'image',
  'video',
  'audio',
  'file',
  'divider',
  'comment',
];

export const hoveringTools = [
  // 'fontSize',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'color',
  'highlight',
  'comment',
];

export const toolsWithOptions = [
  'header',
  'color',
  'highlight',
  'align',
  'list',
  'image',
  'table',
  'video',
  'audio',
  'file',
];
