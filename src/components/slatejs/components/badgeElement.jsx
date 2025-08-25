import styles from './element.module.css';

export default function BadgeElement(props) {
  const { attributes, children } = props;

  return (
    <span contentEditable="false" {...attributes} className={styles.badgeEle}>
      {children}
    </span>
  );
}
