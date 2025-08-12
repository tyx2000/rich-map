import { Minus, Plus } from 'lucide-react';

export default function FontSize() {
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
      >
        <Minus size={18}></Minus>
      </div>
      <input
        style={{
          width: 40,
          textAlign: 'center',
          outline: 'none',
          border: 'none',
        }}
        type="text"
        // value={14}
      />
      <div
        style={{
          width: 30,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Plus size={18}></Plus>
      </div>
    </div>
  );
}
