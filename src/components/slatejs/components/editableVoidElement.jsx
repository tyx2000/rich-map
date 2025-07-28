import { useState } from 'react';

export default function EditableVoidElement(props) {
  const { attributes, children } = props;
  const [inputValue, setInputValue] = useState('');

  return (
    <div {...attributes} contentEditable={false}>
      <div
        style={{
          boxShadow: '0 0 0 3px #ddd',
          padding: 8,
        }}
      >
        <h4>Name:</h4>
        <input
          type="text"
          style={{ margin: '8px 0' }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <h4>Left of right handed:</h4>
        <input
          type="radio"
          style={{ width: 'unset' }}
          name="handedness"
          value="left"
        />
        Left
        <br />
        <input
          type="radio"
          style={{ width: 'unset' }}
          name="handedness"
          value="right"
        />
        Right
        <h4>Tell us about yourself</h4>
        <div style={{ padding: 20, border: '2px solid #ddd' }}></div>
      </div>
      {children}
    </div>
  );
}
