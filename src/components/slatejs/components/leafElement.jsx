import { useRef } from 'react';
import useClickOutside from '../../../hooks/useClickOutside';

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

  console.log(leaf);

  // todo 显示commentInput，选区变更，隐藏commentInput，原选区还带有 withComment mark，需删除
  // done 回传当时selection当commentInput隐藏时 检查回传选区的Mark是否完整
  const hasComment = Object.keys(leaf).some((key) => key.includes('c-'));

  const style = {
    transition: 'all linear 0.1s',
    color: leaf.color || (hasComment ? 'purple' : '') || '',
    backgroundColor:
      leaf.highlight || (hasComment ? leaf.commentBackgroundColor : '') || '',
    borderBottom: leaf.commentBorderColor
      ? `2px solid ${leaf.commentBorderColor}`
      : '',
  };

  const leafRef = useRef();
  useClickOutside(leafRef, () => {
    if (leafRef.current && leaf.commentBorderColor) {
      leafRef.current.style.fontWeight = 'normal';
    }
  });

  // todo 获取当前Leaf的Range，根据Range来定位CommentList, Range未变动时毋需重新计算位置
  // todo 根据Range显示 indicator 高亮当前 mark 的 Leaf（但是存在分割问题
  const handleClickLeaf = () => {
    if (leaf.commentBorderColor) {
      console.log(leaf);

      // const leafCommentIds = Object.keys(leaf).filter((key) =>
      //   key.includes('c-'),
      // );
      // const [relativeLeaf] = Editor.nodes(editor, {
      //   match: (n) => Text.isText(n) && leafCommentIds.some((c) => !!n[c]),
      // });
      // console.log(leafCommentIds, relativeLeaf);

      const commentKeys = Object.keys(leaf).filter((key) => key.includes('c-'));
      const comments = commentKeys.map((key) => leaf[key]);
      if (comments.length === 0) return;
      setComments(comments);

      if (leafRef.current) {
        // 存在因选区重叠而导致的分割问题
        leafRef.current.style.fontWeight = 'bold';
      }
    } else {
      setComments(null);
    }
  };

  return (
    <span
      ref={leafRef}
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
