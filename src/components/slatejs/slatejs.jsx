import { Fragment, useCallback, useEffect, useState } from 'react';
import {
  createEditor as creaetSlateEditor,
  Editor,
  Transforms,
  Node,
  Point,
  Element,
  Text,
  Range,
} from 'slate';
import { Slate, withReact, Editable } from 'slate-react';
import slateCommand from '../../../utils/slateCommand.js';

import LeafElement from './components/leafElement.jsx';
import Toolbar from '../toolbar/toolbar.jsx';
import { serialize, deserialize } from '../../../utils/helper.js';
import SlateElement from './components/index.jsx';
import HoveringToolbar from './components/hoveringToolbar.jsx';
import CommentInput from './components/commentInput.jsx';
import { withHistory } from 'slate-history';
import withCustomerElement from '../../../utils/withCustomerElement.js';
import styles from './slatejs.module.css';
import { faker } from '@faker-js/faker';
import Chunk from './components/chunk.jsx';
import PerformanceControls from '../performanceControls/index.jsx';

// 每个对象即是element属性
const defaultValue = [
  { type: 'heading', children: [{ text: 'Enforce you layout' }] },
  { type: 'paragraph', children: [{ text: 'below checklist' }] },
  {
    type: 'checklist',
    checked: false,
    children: [{ text: 'this is a checklist item' }],
  },
  {
    type: 'code',
    children: [{ text: 'console.log("Hello, world!");' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'below checklist below checklist below checklist below checklist below checklist below checklist below checklist below checklist below checklist',
      },
    ],
  },
  // {
  //   type: 'badge',
  //   children: [{ text: 'block badge' }],
  // },
  // {
  //   type: 'image',
  //   url: 'https://i.imgur.com/VZewSe2.jpeg',
  //   name: 'strange stone',
  //   children: [{ text: '' }],
  // },
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
  // {
  //   type: 'table',
  //   children: [
  //     {
  //       type: 'table-row',
  //       children: [
  //         {
  //           type: 'table-cell',
  //           children: [{ text: '1', bold: true }],
  //         },
  //         {
  //           type: 'table-cell',
  //           children: [{ text: '2', underline: true }],
  //         },
  //         {
  //           type: 'table-cell',
  //           children: [{ text: '3', strikethrough: true }],
  //         },
  //         {
  //           type: 'table-cell',
  //           children: [{ text: '4', italic: true }],
  //         },
  //         {
  //           type: 'table-cell',
  //           children: [{ text: '5', bold: true, italic: true }],
  //         },
  //       ],
  //     },
  //     {
  //       type: 'table-row',
  //       children: [
  //         {
  //           type: 'table-cell',
  //           children: [{ text: 'cccccccccc' }],
  //         },
  //         {
  //           type: 'table-cell',
  //           children: [{ text: 'cccccccccc' }],
  //         },
  //         {
  //           type: 'table-cell',
  //           children: [{ text: 'cccccccccc' }],
  //         },
  //         {
  //           type: 'table-cell',
  //           children: [{ text: 'cccccccccc' }],
  //         },
  //         {
  //           type: 'table-cell',
  //           children: [{ text: 'cccccccccc' }],
  //         },
  //       ],
  //     },
  //   ],
  // },
];

const searchParams =
  typeof document === 'undefined'
    ? null
    : new URLSearchParams(document.location.search);
const parseNumber = (key, defaultValue) =>
  parseInt(searchParams?.get(key) ?? '', 10) || defaultValue;
const parseBoolean = (key, defaultValue) => {
  const value = searchParams?.get(key);
  if (value) return value === 'true';
  return defaultValue;
};
const parseEnum = (key, options, defaultValue) => {
  const value = searchParams?.get(key);
  if (value && options.includes(value)) return value;
  return defaultValue;
};

const initialConfig = {
  blocks: parseNumber('blocks', 10000),
  chunking: parseBoolean('chunking', true),
  chunkSize: parseNumber('chunk_size', 1000),
  chunkDivs: parseBoolean('chunk_divs', true),
  chunkOutlines: parseBoolean('chunk_outlines', false),
  contentVisibilityMode: parseEnum(
    'content_visibility',
    ['none', 'element', 'chunk'],
    'chunk',
  ),
  showSelectedHeadings: parseBoolean('selected_headings', false),
};
const setSearchParams = (config) => {
  if (searchParams) {
    searchParams.set('blocks', config.blocks.toString());
    searchParams.set('chunking', config.chunking ? 'true' : 'false');
    searchParams.set('chunk_size', config.chunkSize.toString());
    searchParams.set('chunk_divs', config.chunkDivs ? 'true' : 'false');
    searchParams.set('chunk_outlines', config.chunkOutlines ? 'true' : 'false');
    searchParams.set('content_visibility', config.contentVisibilityMode);
    searchParams.set(
      'selected_headings',
      config.showSelectedHeadings ? 'true' : 'false',
    );
    history.replaceState({}, '', `?${searchParams.toString()}`);
  }
};
const cachedinitialValue = [];
const getInitialValue = (blocks) => {
  if (cachedinitialValue.length >= blocks) {
    return cachedinitialValue.slice(0, blocks);
  }
  faker.seed(1);
  for (let i = cachedinitialValue.length; i < blocks; i++) {
    if (i % 100 === 0) {
      const heading = {
        type: 'heading-one',
        children: [{ text: faker.lorem.sentence() }],
      };
      cachedinitialValue.push(heading);
    } else {
      const paragraph = {
        type: 'paragraph',
        children: [{ text: faker.lorem.paragraph() }],
      };
      cachedinitialValue.push(paragraph);
    }
  }
  return cachedinitialValue.slice();
};
const initialInitialValue =
  typeof window === 'undefined' ? [] : getInitialValue(initialConfig.blocks);
const createEditor = (config) => {
  const editor = withCustomerElement(
    withHistory(withReact(creaetSlateEditor()), { maxHistory: 10 }),
  );
  // enable chunking, control the number of nodes per lowest-level chunk for a given parent node
  // in most circumstances, setting the chunk size to 1000 for the editor and null for all other ancestors works well
  // chunking can only be enabled for nodes whose children are all block elements
  editor.getChunkSize = (node) =>
    config.chunking && Editor.isEditor(node) ? config.chunkSize : null;
  return editor;
};

export default function Slatejs({ sharedType, provider }) {
  // const [editor] = useState(() => withReact(createEditor()));
  // const editor = useMemo(() => {
  //   const editor = withCustomerElement(withHistory(withReact(createEditor())));
  //   editor.getChunkSize = (node) =>
  //     config.chunking && Editor.isEditor(node) ? config.chunkSize : null;
  //   return editor;
  // }, []);
  // const collaborative = !!(sharedType && provider);

  // const newEditor = (config) => {
  //   const editor = withCustomerElement(
  //     withHistory(
  //       withReact(
  //         withCursors(
  //           withYjs(creaetSlateEditor(), sharedType),
  //           provider.awareness,
  //           {
  //             data: {
  //               name: faker.person.fullName(),
  //               color: '#5e08a0',
  //             },
  //           },
  //         ),
  //       ),
  //     ),
  //   );
  //   const { normalizeNode } = editor;
  //   editor.normalizeNode = (entry, options) => {
  //     const [node] = entry;
  //     if (!Editor.isEditor(node) || node.children.length > 0) {
  //       return normalizeNode(entry, options);
  //     }
  //     Transforms.insertNodes(
  //       editor,
  //       {
  //         children: [{ text: '' }],
  //       },
  //       { at: [0] },
  //     );
  //   };
  //   editor.getChunkSize = (node) =>
  //     config.chunking && Editor.isEditor(node) ? config.chunkSize : null;

  //   return editor;
  // };

  const [rendering, setRendering] = useState(false);
  const [config, baseSetConfig] = useState(initialConfig);
  const [initialValue, setInitialValue] = useState(initialInitialValue);
  const [editor, setEditor] = useState(() => createEditor(config));
  const [editorVersion, setEditorVersion] = useState(0);
  const setConfig = useCallback((partialConfig) => {
    const newConfig = { ...config, ...partialConfig };
    setRendering(true);
    baseSetConfig(newConfig);
    setSearchParams(newConfig);
    setTimeout(() => {
      setRendering(false);
      setInitialValue(getInitialValue(newConfig.blocks));
      setEditor(createEditor(newConfig));
      setEditorVersion((n) => n + 1);
    });
  });

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (editor.selection) {
        const [codeNode] = Editor.nodes(editor, {
          at: editor.selection,
          match: (n) => n.type === 'code',
        });
        if (codeNode && e.key === 'Tab') {
          e.preventDefault();
          Transforms.insertText(editor, '    ');
        }
        if (e.key === 'Escape') {
          // esc 根据情况是否去除选区标记
          slateCommand.toggleComment(editor);
          Transforms.collapse(editor, { edge: 'end' });
          setShowCommentInput(false);
        }
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  // useEffect(() => {
  //   if (collaborative) {
  //     YjsEditor.connect(editor);
  //     return () => {
  //       YjsEditor.disconnect(editor);
  //     };
  //   }
  // }, [editor]);

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

  /**
   *  children
   *  element
   *  attributes
   */
  const renderElement = useCallback(
    (props) => (
      <SlateElement
        {...props}
        contentVisibility={config.contentVisibilityMode === 'element'}
        showSelectedHeadings={config.showSelectedHeadings}
      />
    ),
    [],
  );

  const renderChunk = useCallback(
    (props) => (
      <Chunk
        {...props}
        contentVisibilityLowest={config.contentVisibilityMode === 'chunk'}
        outline={config.chunkOutlines}
      />
    ),
    [config.contentVisibilityMode, config.chunkOutlines],
  );

  /**
   *  children
   *  leaf
   *  text
   *  attributes
   *  leafPosition { start, end, isFirst?, isLast? }
   */
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

  const storeSelection = () => {};

  const restoreSelection = () => {};

  const handleSelectionChange = (selection) => {
    setShowCommentInput(false);
    if (selection) {
      // anchor.path 开始节点路径 anchor.offset 在开始节点中的偏移
      // focus.path 结束节点路径 focus.offset 在结束节点中的偏移
      const { anchor, focus } = selection;
      const isCollapsed = Range.isCollapsed(selection);
      const [node] = Editor.nodes(editor, {
        at: selection,
        match: (n) => !Editor.isEditor(n) && Element.isElement(n),
      });
      if (node) {
        const [element, path] = node;
        const children = element.children;
        if (isCollapsed) {
          let child =
            children.length > 1 ? children[anchor.path[1]] : children[0];
          console.log('child', child);
        } else {
          let startChild =
            children.length > 1 ? children[anchor.path[1]] : children[0];
          let endChild =
            children.length > 1 ? children[focus.path[1]] : children[0];
          // console.log('startChild', startChild);
          // console.log('endChild', endChild);
        }
      }
    }
  };

  const [showCommentInput, setShowCommentInput] = useState(false);
  const commentClickHandler = () => {
    const commentContainer = document.getElementById('commentContainer');
    if (commentContainer) {
      commentContainer.remove();
    }
    // 输入评论添加选区标记
    slateCommand.toggleComment(editor);
    setShowCommentInput(true);
  };
  const onComment = (val) => {
    console.log({ val });
    setShowCommentInput(false);
    if (!val) {
      slateCommand.toggleComment(editor);
      Transforms.collapse(editor, { edge: 'end' });
    } else {
      slateCommand.toggleComment(editor, val);
    }
    // todo 评论与对应的selection怎么存
    // todo selection内容变动与评论同步变化
    // todo selection被删除同步删除对应的评论
  };

  return (
    <Fragment>
      {/* <PerformanceControls
        editor={editor}
        config={config}
        setConfig={setConfig}
      /> */}

      {rendering ? (
        <div>Rendering&hellip;</div>
      ) : (
        <Slate
          key={editorVersion}
          editor={editor}
          // initialValue={initialValue}
          initialValue={defaultValue}
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
          onSelectionChange={handleSelectionChange}
        >
          <Toolbar commentClickHandler={commentClickHandler} />
          <HoveringToolbar
            showCommentInput={showCommentInput}
            commentClickHandler={commentClickHandler}
          />
          <CommentInput onOk={onComment} showCommentInput={showCommentInput} />
          {/* <div className={styles.editableWrapper} contentEditable={false}> */}
          <Editable
            className={styles.editable}
            spellCheck
            autoFocus
            decorate={decorate}
            renderElement={renderElement}
            renderChunk={config.chunkDivs ? renderChunk : undefined}
            renderLeaf={renderLeaf}
            // onKeyDown={handleEditorKeydown}
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
          {/* </div> */}
        </Slate>
      )}
    </Fragment>
  );
}
