import { Fragment } from 'react';
import styles from '../toolButton.module.css';
import { useSlate } from 'slate-react';
import { Range } from 'slate';
import slateCommand from '../../../../utils/slateCommand';

export default function Header() {
  const editor = useSlate();
  const handleHeaderOptionClick = (header) => {
    if (editor.selection && !Range.isCollapsed(editor.selection)) {
      slateCommand.toggleMark(editor, header);
    }
  };
  return (
    <Fragment>
      <div
        className={styles.optionsItem}
        onClick={() => handleHeaderOptionClick('h1')}
      >
        <h1>h1</h1>
      </div>
      <div
        className={styles.optionsItem}
        onClick={() => handleHeaderOptionClick('h2')}
      >
        <h2>h2</h2>
      </div>
      <div
        className={styles.optionsItem}
        onClick={() => handleHeaderOptionClick('h3')}
      >
        <h3>h3</h3>
      </div>
      <div
        className={styles.optionsItem}
        onClick={() => handleHeaderOptionClick('h4')}
      >
        <h4>h4</h4>
      </div>
      <div
        className={styles.optionsItem}
        onClick={() => handleHeaderOptionClick('h5')}
      >
        <h5>h5</h5>
      </div>
    </Fragment>
  );
}
