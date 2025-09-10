import colors from '../../../constances/colors';

const bgColors = Object.keys(colors)
  .map((type) => colors[type][1])
  .slice(1);
const borderBottomColors = Object.keys(colors)
  .map((type) => colors[type][3])
  .slice(1);

export default function CommentElement({ attributes, element, children }) {
  const clickCommentHandler = (e) => {
    e.stopPropagation();
    console.log('CommentElement', element);
  };

  const commentNodeStyle = {
    borderBottom: element.comments
      ? `2px solid ${borderBottomColors[Math.floor(Math.random() * borderBottomColors.length)]}`
      : 'none',
    backgroundColor: element.comments
      ? bgColors[Math.floor(Math.random() * bgColors.length)]
      : 'transparent',
  };

  return (
    <span
      {...attributes}
      style={commentNodeStyle}
      onClick={clickCommentHandler}
    >
      {children}
    </span>
  );
}
