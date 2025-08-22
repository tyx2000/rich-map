export default function Heading({ level, align, children }) {
  const HeadingTag = level || 'h2';
  return (
    <HeadingTag style={{ textAlign: align || 'left' }}>{children}</HeadingTag>
  );
}
