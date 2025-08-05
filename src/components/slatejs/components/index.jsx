import DefaultElement from './defaultElement';
import CodeElement from './codeElement';
import ChecklistItemElement from './checklistItemElement';
import ImageElement from './imageElement';
import EditableVoidElement from './editableVoidElement';
import VideoElement from './videoElement';
import ListElement from './listElement';

export default function SlateElement(props) {
  console.log('element', props.element);
  const { type, align } = props.element;
  switch (type) {
    case 'title':
      return (
        <h2 style={{ textAlign: align || 'left' }} {...props.attributes}>
          {props.children}
        </h2>
      );
    case 'paragraph':
      return (
        <p style={{ textAlign: align || 'left' }} {...props.attributes}>
          {props.children}
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
    default:
      return <DefaultElement {...props} />;
  }
}
