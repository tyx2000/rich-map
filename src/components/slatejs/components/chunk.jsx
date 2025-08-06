export default function Chunk({
  attributes,
  children,
  lowest,
  contentVisibilityLowest,
  outline,
}) {
  const style = {
    contentVisibility: contentVisibilityLowest && lowest ? 'auto' : undefined,
    border: outline ? '1px solid red' : undefined,
    padding: outline ? 20 : undefined,
    marginBottom: outline ? 20 : undefined,
  };
  return (
    <div {...attributes} style={style}>
      {children}
    </div>
  );
}
