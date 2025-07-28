import { useMemo, useState } from 'react';
import { useSlateStatic } from 'slate-react';

const UrlInput = ({ url, onChange }) => {
  const [value, setValue] = useState(url);
  return (
    <input
      type="text"
      value={value}
      onClick={(e) => e.stopPropagation()}
      style={{
        marginTop: '5px',
        boxSizing: 'border-box',
      }}
      onChange={(e) => {
        const newUrl = e.target.value;
        setValue(newUrl);
        onChange(newUrl);
      }}
    />
  );
};

export default function VideoElement(props) {
  const editor = useSlateStatic();
  const { attributes, children, element } = props;
  const { url } = element;
  const safeUrl = useMemo(() => {
    let parsedUrl = null;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      console.log('parsedUrl error');
    }
    if (parsedUrl && ['https:', 'http:'].includes(parsedUrl.protocol)) {
      return parsedUrl.href;
    }
    return 'about:blank';
  }, [url]);

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <div style={{ padding: '75% 0 0 0', position: 'relative' }}>
          <iframe
            src={`${safeUrl}?title=0&byline=0&portrait=0`}
            frameborder="0"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          ></iframe>
        </div>
        <UrlInput
          url={url}
          onChange={(val) => {
            const path = ReactEditor.findPath(editor, element);
            const newProperties = {
              url: val,
            };
            Transforms.setNodes(editor, newProperties, {
              at: path,
            });
          }}
        />
      </div>
      {children}
    </div>
  );
}
