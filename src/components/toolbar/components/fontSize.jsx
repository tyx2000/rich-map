import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export default function FontSize({ onSet }) {
  const [fontSize, setFontSize] = useState(14);
  const onChangeFontSize = (type, size) => {
    if (size) {
      setFontSize(size);
      onSet('fontSize', size);
    } else {
      const newSize = type === 'minus' ? fontSize - 1 : fontSize + 1;
      const finalSize = newSize > 30 || newSize < 10 ? fontSize : newSize;
      setFontSize(finalSize);
      onSet('fontSize', finalSize);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 30,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={() => onChangeFontSize('minus')}
      >
        <Minus size={16}></Minus>
      </div>
      <input
        style={{
          width: 40,
          textAlign: 'center',
          outline: 'none',
          border: 'none',
        }}
        disabled
        type="text"
        value={fontSize}
      />
      <div
        style={{
          width: 30,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={() => onChangeFontSize('plus')}
      >
        <Plus size={16}></Plus>
      </div>
    </div>
  );
}
