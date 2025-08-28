import { getSelectionOffset } from '../../../../utils/helper';
import styles from './element.module.css';

export default function LeafElement({ attributes, children, leaf }) {
  leaf.comments && console.log(leaf);
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
    const el = document.getElementById('commentContainer');
    if (el) return;
    if (leaf.comments) {
      const commentContainer = document.createElement('div');
      commentContainer.id = 'commentContainer';
      commentContainer.className = styles.commentContainer;
      const offset = getSelectionOffset();
      commentContainer.style.top = `${offset.top + window.pageYOffset + offset.height}px`;
      commentContainer.style.left = `${offset.left + window.pageXOffset - commentContainer.offsetWidth / 2 + offset.width / 2}px`;
      document.body.appendChild(commentContainer);

      leaf.comments.forEach(
        ({ id, timestamp, username, comment, commentFor }) => {
          const commentEl = document.createElement('div');
          commentEl.className = styles.comment;
          commentEl.innerHTML = `
          <div key=${id} class=${styles.author}>
            ${username}&nbsp;&nbsp;
            <span class=${styles.time}>
              ${new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div class=${styles.commentFor}>${commentFor}</div>
          <div class=${styles.content}>
            ${comment}
          </div>
          `;
          commentContainer.appendChild(commentEl);
        },
      );
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
