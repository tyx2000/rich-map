export default function ColorPicker({ name, onSet }) {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}
    >
      {[
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple',
        'pink',
        'lightblue',
        'gray',
      ].map((color) => (
        <div
          onClick={() => onSet(name, color)}
          key={color}
          style={{
            width: 25,
            height: 25,
            backgroundColor: color,
            borderRadius: '50%',
          }}
        ></div>
      ))}
    </div>
  );
}
