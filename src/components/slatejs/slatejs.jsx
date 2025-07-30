import { useCallback, useMemo, useState } from 'react';
import {
  createEditor,
  Editor,
  Transforms,
  Node,
  Point,
  Element,
  Text,
} from 'slate';
import { Slate, withReact, Editable } from 'slate-react';
import slateCommand from '../../../utils/slateCommand.js';

import LeafElement from './components/leafElement.jsx';
import Toolbar from './toolbar';
import { serialize, deserialize } from '../../../utils/helper.js';
import SlateElement from './components/index.jsx';
import HoveringToolbar from './components/hoveringToolbar.jsx';
import { withHistory } from 'slate-history';
import withCustomerElement from '../../../utils/withCustomerElement.js';

const initialValue = [
  { type: 'title', children: [{ text: 'Enforce you layout' }] },
  { type: 'paragraph', children: [{ text: 'below checklist' }] },
  {
    type: 'checklistItem',
    checked: false,
    children: [{ text: 'slide to left' }],
  },
  {
    type: 'image',
    url: 'https://i.imgur.com/VZewSe2.jpeg',
    name: 'strange stone',
    children: [{ text: '' }],
  },
  // {
  //   type: 'video',
  //   url: 'https://player.vimeo.com/video/26689853',
  //   // url: 'https://youtu.be/ekr2nIex040?si=fwU_-yF_SFG7Eye-',
  //   children: [{ text: '' }],
  // },
  // {
  //   type: 'editableVoid',
  //   children: [{ text: '' }],
  // },
];

export default function Slatejs() {
  // const [editor] = useState(() => withReact(createEditor()));
  const editor = useMemo(
    () => withCustomerElement(withHistory(withReact(createEditor()))),
    [],
  );

  // const initialValue = useMemo(
  //   () =>
  //     // deserialize(localStorage.getItem("content-serialize") || ""),
  //     JSON.parse(
  //       localStorage.getItem('content') ||
  //         JSON.stringify([
  //           {
  //             type: 'paragraph',
  //             children: [{ text: 'A line of text in a paragraph.' }],
  //           },
  //         ]),
  //     ),
  //   [],
  // );

  const renderElement = useCallback((props) => <SlateElement {...props} />, []);

  const renderLeaf = useCallback((props) => <LeafElement {...props} />, []);

  const handleEditorKeydown = (event) => {
    if (!event.ctrlKey) {
      return;
    }
    switch (event.key) {
      case '`':
        event.preventDefault();
        slateCommand.toggleCodeBlock(editor);
        break;
      case 'b':
        console.log('emmmmmm');
        event.preventDefault();
        slateCommand.toggleBoldMark(editor);
        break;
    }
  };

  const onDOMBeforeInput = (event) => {
    console.log('onDOMBeforeInput', event);
    switch (event.inputType) {
      case 'bold':
        slateCommand.toggleMark(editor, 'bold');
        break;
      default:
        console.log('unknown inputType', event.inputType);
        break;
    }
  };

  const resetNodes = (editor, { nodes, at }) => {
    const children = [...editor.children];
    children.forEach((node) => {
      editor.apply({ type: 'remove_node', path: [0], node });
    });
    if (nodes) {
      const nodes = Node.isNode(nodes) ? [nodes] : nodes;
      nodes.forEach((node, index) => {
        editor.apply({ type: 'insert_node', path: [index], node });
      });
    }
    const point = at && Point.isPoint(at) ? at : Editor.end(editor, []);
    if (point) {
      Transforms.select(editor, point);
    }
  };

  const [searchValue, setSearchValue] = useState('');
  const decorate = useCallback(
    ([node, path]) => {
      const ranges = [];
      if (
        searchValue &&
        Element.isElement(node) &&
        Array.isArray(node.children) &&
        node.children.every(Text.isText)
      ) {
        const texts = node.children.map((it) => it.text);
        const str = texts.join('');
        const length = search.length;
        let start = str.indexOf(search);
        let index = 0;
        let iterated = 0;
        while (start !== -1) {
          while (
            index < texts.length &&
            start >= iterated + texts[index].length
          ) {
            iterated += texts[index].length;
            index++;
          }
          let offset = start - iterated;
          let remaining = length;
          while (index < texts.length && remaining > 0) {
            const currentText = texts[index];
            const currentPath = [...path, index];
            const taken = Math.min(remaining, currentText.length - offset);
            ranges.push({
              anchor: { path: currentPath, offset },
              focus: { path: currentPath, offset: offset + taken },
              highlight: true,
            });
            remaining -= taken;
            if (remaining > 0) {
              iterated += currentText.length;
              offset = 0;
              index++;
            }
          }
          start = str.indexOf(search, start + search.length);
        }
      }
      return ranges;
    },
    [searchValue],
  );

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => 'set_selection' !== op.type,
        );
        if (isAstChange) {
          const content = JSON.stringify(value);
          localStorage.setItem('content', content);
          localStorage.setItem('content-serialize', serialize(value));
        }
      }}
    >
      <Toolbar />
      <HoveringToolbar />
      <Editable
        style={{
          padding: '20px',
          border: '1px solid #ccc',
          flex: 1,
          backgroundColor: '#fff',
          color: '#000',
          borderRadius: '10px',
          outline: 'none',
        }}
        spellCheck
        autoFocus
        decorate={decorate}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleEditorKeydown}
        // onDOMBeforeInput={onDOMBeforeInput}
        placeholder="emmmmmmmmmmmmmmmmm"
        renderPlaceholder={({ children, attributes }) => (
          <div {...attributes}>
            {children}
            <pre>
              Use the renderPlaceholder prop to customize rendering of the
              placeholder
            </pre>
          </div>
        )}
      />
    </Slate>
  );
}
