import { useReadOnly } from 'slate-react';

const PrefixWrapper = ({ children }) => (
  <div
    style={{
      width: 28,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </div>
);

const prefix = (type) =>
  ({
    default: (
      <PrefixWrapper>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#000',
          }}
        ></div>
      </PrefixWrapper>
    ),
    circle: (
      <PrefixWrapper>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            border: '1px solid #000',
          }}
        ></div>
      </PrefixWrapper>
    ),
    square: (
      <PrefixWrapper>
        <div
          style={{
            width: 7,
            height: 7,
            backgroundColor: '#000',
          }}
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
    <div {...attributes} style={{ display: 'flex' }}>
      {prefix(element.prefix)}
      <div
        contentEditable={!readonly}
        suppressContentEditableWarning
        style={{
          flex: 1,
          color: 'purple',
          outline: 'none',
          borderBottom: '1px dashed red',
        }}
      >
        {children}
      </div>
    </div>
  );
}
