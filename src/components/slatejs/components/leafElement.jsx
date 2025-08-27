import styles from './element.module.css';

export default function LeafElement({ attributes, children, leaf }) {
  console.log(leaf);
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

  const style = {
    color: leaf.color || (leaf.comments ? '#C10007' : '') || '',
    backgroundColor: leaf.highlight || (leaf.comments ? '#FFE2E2' : '') || '',
    textDecorationLine: leaf.comments ? 'grammar-error' : '',
  };

  const handleClickLeaf = () => {
    console.log('clickLeaf', leaf);
    const el = document.getElementById('commentContainer');
    if (el) return;
    if (leaf.attachComment) {
      let comments = [];
      Object.entries(leaf).forEach(([k, v]) => {
        if (k.includes('comment')) {
          comments.push({ key: k, value: v });
        }
      });
      const commentContainer = document.createElement('div');
      commentContainer.id = 'commentContainer';
      commentContainer.className = styles.commentContainer;
      document.body.appendChild(commentContainer);

      comments.forEach(({ key, value }) => {
        const comment = document.createElement('div');
        comment.className = styles.comment;
        comment.innerHTML = `<div class=${styles.author}>${key}</div><div class=${styles.content}>${value}</div>`;
        commentContainer.appendChild(comment);
      });
    }
  };

  return (
    <span
      {...attributes}
      {...(leaf.highlight && { 'data-cy': 'search-highlight' })}
      style={style}
      onClick={handleClickLeaf}
    >
      {children}
    </span>
  );
}
