import { useReadOnly } from 'slate-react';
import styles from './element.module.css';

const PrefixWrapper = ({ children }) => (
  <div contentEditable={false} className={styles.listPrefixWrapper}>
    {children}
  </div>
);

const prefix = (type) =>
  ({
    default: (
      <PrefixWrapper>
        <div className={styles.listPrefixType}></div>
      </PrefixWrapper>
    ),
    circle: (
      <PrefixWrapper>
        <div
          className={styles.listPrefixType}
          style={{
            backgroundColor: '#fff',
            border: '1px solid #000',
          }}
        ></div>
      </PrefixWrapper>
    ),
    square: (
      <PrefixWrapper>
        <div
          className={styles.listPrefixType}
          style={{ borderRadius: 0 }}
        ></div>
      </PrefixWrapper>
    ),
    decimal: (
      <PrefixWrapper>
        <div>1</div>
      </PrefixWrapper>
    ),
    lowerAlpha: (
      <PrefixWrapper>
        <div>a</div>
      </PrefixWrapper>
    ),
  })[type] || null;

export default function ListElement(props) {
  const { attributes, children, element } = props;
  const readonly = useReadOnly();
  return (
    <div {...attributes} className={styles.listItem}>
      {prefix(element.prefix)}
      <div
        contentEditable={!readonly}
        suppressContentEditableWarning
        className={styles.content}
      >
        {children}
      </div>
    </div>
  );
}
