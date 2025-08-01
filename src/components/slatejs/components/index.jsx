import DefaultElement from './defaultElement';
import CodeElement from './codeElement';
import ChecklistItemElement from './checklistItemElement';
import ImageElement from './imageElement';
import EditableVoidElement from './editableVoidElement';
import VideoElement from './videoElement';

export default function SlateElement(props) {
  switch (props.element.type) {
    case 'title':
      return <h2 {...props.attributes}>{props.children}</h2>;
    case 'paragraph':
      return <p {...props.attributes}>{props.children}</p>;
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
    default:
      return <DefaultElement {...props} />;
  }
}
