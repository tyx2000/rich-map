import styles from './element.module.css';

export default function LinkElement(props) {
  console.log(props);
  const { attributes, element, children } = props;
  const { url } = element;
  return (
    <span
      title={url || ''}
      {...attributes}
      className={styles.linkWrapper}
      // onClick={() => url && window.open(url)}
    >
      {children}
    </span>
  );
}
