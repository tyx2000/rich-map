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
  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  if (leaf.h1) {
    children = <h1>{children}</h1>;
  }
  if (leaf.h2) {
    children = <h2>{children}</h2>;
  }
  if (leaf.h3) {
    children = <h3>{children}</h3>;
  }
  if (leaf.h4) {
    children = <h4>{children}</h4>;
  }
  if (leaf.h5) {
    children = <h5>{children}</h5>;
  }

  console.log('>>', leaf);

  return (
    <span
      {...attributes}
      {...(leaf.highlight && { 'data-cy': 'search-highlight' })}
      style={{
        backgroundColor: leaf.highlight || '',
        color: leaf.color || '',
      }}
      // style={{backgroundColor: leaf.highlight && '#ffeeba'}}
    >
      {children}
    </span>
  );
}
