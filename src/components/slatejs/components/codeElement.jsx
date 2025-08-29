import styles from './element.module.css';

export default function CodeElement(props) {
  return (
    <pre draggable={false} className={styles.codeBlock} {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
}
