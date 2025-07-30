export default function LeafElement({ attributes, children, leaf }) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.del) {
    children = <del>{children}</del>;
  }

  console.log('====>>>>>>>>>', leaf);

  return (
    <span
      {...attributes}
      {...(leaf.highlight && { 'data-cy': 'search-highlight' })}
      style={{
        backgroundColor: leaf.backgroundColor || '',
        color: leaf.color || '',
      }}
      // style={{backgroundColor: leaf.highlight && '#ffeeba'}}
    >
      {children}
    </span>
  );
}
