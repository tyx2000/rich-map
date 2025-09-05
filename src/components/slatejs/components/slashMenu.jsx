import { useEffect, useRef } from 'react';
import Portal from '../../portal';
import styles from './element.module.css';
import {
  getSelectionOffset,
  makeElementVisiable,
} from '../../../../utils/helper';

const elements = [
  {
    icon: '',
    label: 'Text',
  },
  {
    type: 'Heading',
    children: [
      {
        icon: '',
        label: 'Heading1',
      },
      {
        icon: '',
        label: 'Heading2',
      },
      {
        icon: '',
        label: 'Heading3',
      },
      {
        icon: '',
        label: 'Heading4',
      },
      {
        icon: '',
        label: 'Heading5',
      },
    ],
  },
  {
    type: 'List',
    children: [
      {
        icon: '',
        label: 'Default',
      },
      {
        icon: '',
        label: 'Circle',
      },
      {
        icon: '',
        label: 'Square',
      },
      {
        icon: '',
        label: 'Decimal',
      },
      {
        icon: '',
        label: 'Lower Alpha',
      },
    ],
  },
  {
    icon: '',
    label: 'To-Do List',
  },
  {
    icon: '',
    label: 'Link',
  },
  {
    icon: '',
    label: 'Table',
  },
];

export default function SlashMenu({ showSlashMenu }) {
  if (!showSlashMenu) return null;
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (showSlashMenu) {
      const offset = getSelectionOffset();
      el.style.opacity = '1';
      el.style.top = `${offset.top + window.pageYOffset + offset.height}px`;
      el.style.left = `${offset.left + 10}px`;

      makeElementVisiable(el);
    }
  }, [showSlashMenu]);

  return (
    <Portal>
      <div
        ref={ref}
        className={[styles.hoveringTool, styles.slashMenu].join(' ')}
      >
        {elements.map((element) => {
          if (element.children) {
            return (
              <div key={element.type} className={styles.elementGroup}>
                &nbsp;&nbsp;&nbsp;{element.type}
                {element.children.map((child) => (
                  <div key={child.label} className={styles.elementItem}>
                    <div className={styles.elementIcon}>{child.icon}</div>
                    <div className={styles.elementLabel}>{child.label}</div>
                  </div>
                ))}
              </div>
            );
          } else {
            return (
              <div key={element.label} className={styles.elementItem}>
                <div className={styles.elementIcon}>{element.icon}</div>
                <div className={styles.elementLabel}>{element.label}</div>
              </div>
            );
          }
        })}
      </div>
    </Portal>
  );
}
