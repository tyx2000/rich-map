export default function LinkElement(props) {
  console.log(props);
  return (
    <a
      href="google.com"
      {...props.attributes}
      style={{
        color: 'purple',
        fontSize: 14,
        backgroundColor: '#f1f1f1',
        padding: '3px 5px',
        borderRadius: 2,
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
    >
      click to google
    </a>
  );
}
