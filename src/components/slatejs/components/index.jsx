import DefaultElement from './defaultElement';
import CodeElement from './codeElement';
import ChecklistItemElement from './checklistItemElement';
import ImageElement from './imageElement';
import EditableVoidElement from './editableVoidElement';
import VideoElement from './videoElement';
import ListElement from './listElement';
import { useSelected } from 'slate-react';
import { GripVertical } from 'lucide-react';
import styles from './element.module.css';

const Heading = ({ styleProps, showSelectedHeadings = false, ...props }) => {
  const selected = showSelectedHeadings ? useSelected() : false;
  const style = { ...styleProps, color: selected ? 'green' : undefined };
  return <h1 {...props} selected={selected} style={style}></h1>;
};

export default function SlateElement(props) {
  const {
    attributes,
    element,
    children,
    contentVisibility,
    showSelectedHeadings,
  } = props;
  console.log({ element });
  const { type, align } = element || {};
  const style = {
    contentVisibility: contentVisibility ? 'auto' : undefined,
  };
  const renderElement = () => {
    switch (type) {
      case 'heading-one':
        return <h1>{children}</h1>;
      case 'title':
        return <h2 style={{ textAlign: align || 'left' }}>{children}</h2>;
      case 'paragraph':
        return <p style={{ textAlign: align || 'left' }}>{children}</p>;
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
      default:
        return <DefaultElement {...props} />;
    }
  };
  return renderElement();

  // return (
  //   <div
  //     {...attributes}
  //     className={styles.elementWrapper}
  //     style={{
  //       contentVisibility: contentVisibility ? 'auto' : undefined,
  //     }}
  //   >
  //     <GripVertical
  //       size={16}
  //       color="#737373"
  //       className={styles.dragIcon}
  //     />
  //     {renderElement()}
  //   </div>
  // );
}
