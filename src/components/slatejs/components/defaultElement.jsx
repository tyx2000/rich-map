export default function DefaultElement(props) {
  return (
    <div
      {...props.attributes}
      style={{ flex: 1, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
    >
      {props.children}
    </div>
  );
}
