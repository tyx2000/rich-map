import DefaultElement from './defaultElement';
import CodeElement from './codeElement';
import ChecklistItemElement from './checklistItemElement';
import ImageElement from './imageElement';
import EditableVoidElement from './editableVoidElement';
import VideoElement from './videoElement';
import ListElement from './listElement';
import Heading from './heading';
import LinkElement from './linkElement';
import BadgeElement from './badgeElement';
import DragWrapper from './dragWrapper';
import CommentElement from './commentElement';

export default function SlateElement(props) {
  const {
    attributes,
    element,
    children,
    contentVisibility,
    showSelectedHeadings,
  } = props;
  const { type, align, level } = element || {};
  const style = {
    contentVisibility: contentVisibility ? 'auto' : undefined,
  };

  const renderElement = () => {
    switch (type) {
      case 'heading':
        return (
          <Heading level={level || 'h2'} align={align}>
            {children}
          </Heading>
        );
      case 'paragraph':
        return (
          <p
            style={{
              textAlign: align || 'left',
              padding: '5px 0',
              flex: 1,
              wordBreak: 'break-word',
            }}
          >
            {children}
          </p>
        );
      case 'code':
        return <CodeElement {...props} />;
      case 'checklist':
        return <ChecklistItemElement {...props} />;
      case 'image':
        return <ImageElement {...props} />;
      case 'video':
        return <VideoElement {...props} />;
      case 'editableVoid':
        return <EditableVoidElement {...props} />;
      case 'list':
        return <ListElement {...props} />;
      case 'link':
        return <LinkElement {...props} />;
      case 'badge':
        return <BadgeElement {...props} />;
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
            <tbody>{children}</tbody>
          </table>
        );
      case 'table-row':
        return <tr>{children}</tr>;
      case 'table-cell':
        return (
          <td
            style={{
              borderRight: '1px solid #000',
              borderBottom: '1px solid #000',
            }}
          >
            {children}
          </td>
        );
      case 'comment':
        return <CommentElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  };

  const inlineElement = ['link', 'comment'];

  return inlineElement.includes(type) ? (
    renderElement()
  ) : (
    <DragWrapper
      attributes={attributes}
      elementType={type}
      style={{
        contentVisibility: contentVisibility ? 'auto' : undefined,
      }}
    >
      {renderElement()}
    </DragWrapper>
  );
}
