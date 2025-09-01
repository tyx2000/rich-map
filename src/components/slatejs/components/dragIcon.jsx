import styles from './element.module.css';

export default function DragIcon({ onMouseDown }) {
  return (
    <div
      contentEditable={false}
      className={styles.dragIcon}
      onMouseDown={onMouseDown}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
