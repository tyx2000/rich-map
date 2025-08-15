export default function DefaultElement(props) {
  return <pre {...props.attributes}>{props.children}</pre>;
}
