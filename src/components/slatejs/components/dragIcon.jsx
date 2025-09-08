import { Fragment } from 'react';
import styles from './element.module.css';

const undraggableElementType = ['drop-indicator'];

export default function DragIcon({ onMouseDown, elementType }) {
  const isElementDraggable = !undraggableElementType.includes(elementType);
  return (
    <div
      contentEditable={false}
      className={styles.dragIcon}
      onMouseDown={isElementDraggable ? onMouseDown : () => {}}
    >
      {isElementDraggable ? (
        <Fragment>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Fragment>
      ) : null}
    </div>
  );
}
