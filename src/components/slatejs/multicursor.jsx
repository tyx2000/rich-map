import { useRemoteCursorOverlayPositions } from '@slate-yjs/react';
import { useRef } from 'react';
import styles from './multicursor.module.css';

function Caret({ caretPosition, data }) {
  const caretStyle = {
    ...caretPosition,
    background: data?.color,
  };

  const labelStyle = {
    transform: 'translateY(-100%)',
    background: data?.color,
  };

  return (
    <div style={caretStyle} className={styles.caretMarker}>
      <div className={styles.caret} style={labelStyle}>
        {data?.name}
      </div>
    </div>
  );
}

function Selection({ data, selectionRects, caretPosition }) {
  if (!data) {
    return null;
  }

  const selectionStyle = {
    backgroundColor: data.color,
  };

  return (
    <>
      {selectionRects.map((position, i) => (
        <div
          style={{ ...selectionStyle, ...position }}
          className={styles.selection}
          key={i}
        />
      ))}
      {caretPosition && <Caret caretPosition={caretPosition} data={data} />}
    </>
  );
}

export function Cursors({ children }) {
  const containerRef = useRef(null);
  const [cursors] = useRemoteCursorOverlayPositions({ containerRef });
  // console.log({ cursors });

  return (
    <div className={styles.cursor} ref={containerRef}>
      {children}
      {cursors.map((cursor) => (
        <Selection key={cursor.clientId} {...cursor} />
      ))}
    </div>
  );
}
