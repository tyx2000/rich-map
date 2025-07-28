export default function CodeElement(props) {
  return (
    <pre
      style={{ backgroundColor: 'red', color: '#fff' }}
      {...props.attributes}
    >
      <code>{props.children}</code>
    </pre>
  );
}
