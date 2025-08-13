export default function TableSize({ onSet }) {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 5 }}
    >
      {new Array(64).fill(1).map((item, index) => (
        <div
          key={item + index}
          style={{
            padding: 2,
            borderRadius: 3,
            fontSize: 10,
            border: '1px solid #000',
            cursor: 'pointer',
          }}
          onClick={() => onSet('table', index)}
        >
          {index}
        </div>
      ))}
    </div>
  );
}
