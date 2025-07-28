import DefaultElement from './defaultElement';
import CodeElement from './codeElement';
import ChecklistItemElement from './checklistItemElement';
import ImageElement from './imageElement';
import EditableVoidElement from './editableVoidElement';
import VideoElement from './videoElement';

export default function SlateElement(props) {
  console.log('elementType', props.element.type);
  switch (props.element.type) {
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
