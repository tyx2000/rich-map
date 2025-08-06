import DefaultElement from './defaultElement';
import CodeElement from './codeElement';
import ChecklistItemElement from './checklistItemElement';
import ImageElement from './imageElement';
import EditableVoidElement from './editableVoidElement';
import VideoElement from './videoElement';
import ListElement from './listElement';
import { useSelected } from 'slate-react';

const Heading = ({ styleProps, showSelectedHeadings = false, ...props }) => {
  const selected = showSelectedHeadings ? useSelected() : false;
  const style = { ...styleProps, color: selected ? 'green' : undefined };
  return <h1 {...props} selected={selected} style={style}></h1>;
};

export default function SlateElement({
  attributes,
  element,
  children,
  contentVisibility,
  showSelectedHeadings,
}) {
  console.log('element', element);
  const { type, align } = element || {};
  const style = {
    contentVisibility: contentVisibility ? 'auto' : undefined,
  };
  switch (type) {
    case 'heading-one':
      return (
        <Heading
          {...attributes}
          styleProps={style}
          showSelectedHeadings={showSelectedHeadings}
        >
          {children}
        </Heading>
      );
    case 'title':
      return (
        <h2 style={{ textAlign: align || 'left' }} {...attributes}>
          {children}
        </h2>
      );
    case 'paragraph':
      return (
        <p style={{ textAlign: align || 'left' }} {...attributes}>
          {children}
        </p>
      );
    case 'code':
      return <CodeElement {...props} />;
    case 'checklistItem':
      return <ChecklistItemElement {...props} />;
    case 'image':
      return <ImageElement {...props} />;
    case 'video':
      return <VideoElement {...props} />;
    case 'editableVoid':
      return <EditableVoidElement {...props} />;
    case 'listItem':
      return <ListElement {...props} />;
    case 'table':
      return (
        <table
          style={{
            margin: 10,
            position: 'relative',
            borderTop: '1px solid #000',
            borderLeft: '1px solid #000',
          }}
        >
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case 'table-row':
      return <tr {...attributes}>{children}</tr>;
    case 'table-cell':
      return (
        <td
          {...attributes}
          style={{
            borderRight: '1px solid #000',
            borderBottom: '1px solid #000',
          }}
        >
          {children}
        </td>
      );
    default:
      return <DefaultElement {...props} />;
  }
}
