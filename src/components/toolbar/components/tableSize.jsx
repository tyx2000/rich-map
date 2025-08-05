export default function TableSize({ onSetFormat }) {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 5 }}
    >
      {new Array(64).fill(1).map((item, index) => (
        <div
          key={item + index}
          style={{
            width: 10,
            height: 7,
            borderRadius: 3,
            fontSize: 10,
            border: '1px solid #000',
          }}
          onClick={() => onSetFormat(index)}
        ></div>
      ))}
    </div>
  );
}
