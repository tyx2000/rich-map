export default function LeafElement({
  attributes,
  children,
  leaf,
  setComments,
}) {
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

  // todo 显示commentInput，选区变更，隐藏commentInput，原选区还带有 withComment mark，需删除
  const hasComment = Object.keys(leaf).some((key) => key.includes('c-'));

  const style = {
    color: leaf.color || (hasComment ? '#C10007' : '') || '',
    backgroundColor: leaf.highlight || (hasComment ? '#FFE2E2' : '') || '',
    borderBottom: leaf.withComment ? '2px solid purple' : '',
  };

  // todo 获取当前Leaf的Range，根据Range来定位CommentList, Range未变动时毋需重新计算位置
  // todo 根据Range显示 indicator 高亮当前 mark 的 Leaf（但是存在分割问题
  const handleClickLeaf = () => {
    if (leaf.withComment) {
      const commentKeys = Object.keys(leaf).filter((key) => key.includes('c-'));
      const comments = commentKeys.map((key) => leaf[key]);
      if (comments.length === 0) return;
      setComments(comments);
    } else {
      setComments(null);
    }
  };

  return (
    <span
      {...attributes}
      {...(leaf.highlight && { 'data-cy': 'search-highlight' })}
      style={style}
      onClick={handleClickLeaf}
    >
      {/* {leaf.text ? (
        children
      ) : (
        <span style={{ color: '#ccc' }}>Type Something</span>
      )} */}
      {children}
    </span>
  );
}
