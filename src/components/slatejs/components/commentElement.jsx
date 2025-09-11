import colors from '../../../constances/colors';

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
        borderBottom: element.borderBottom,
        backgroundColor: element.backgroundColor || '',
      }}
      onClick={clickCommentHandler}
    >
      {children}
    </span>
  );
}
