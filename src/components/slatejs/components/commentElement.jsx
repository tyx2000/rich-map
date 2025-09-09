export default function CommentElement({ attributes, element, children }) {
  const clickCommentHandler = (e) => {
    e.stopPropagation();
    console.log('CommentElement', element);
  };
  console.log(element);
  return (
    <span
      {...attributes}
      style={{
        borderBottom: element.comments ? '2px solid purple' : 'none',
      }}
      onClick={clickCommentHandler}
    >
      {children}
    </span>
  );
}
