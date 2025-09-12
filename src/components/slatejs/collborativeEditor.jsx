import { getYjsProviderForRoom } from '@liveblocks/yjs';
import { withYjs, YjsEditor, withCursors } from '@slate-yjs/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createEditor, Editor, Range, Transforms } from 'slate';
import { withReact, Slate, Editable } from 'slate-react';
import styles from './collborativeEditor.module.css';
import * as Y from 'yjs';
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useRoom,
} from '@liveblocks/react/suspense';
import { Cursors } from './multicursor';
import { faker } from '@faker-js/faker';
import withCustomerElement from '../../../utils/withCustomerElement';
import Toolbar from '../toolbar/toolbar';
import HoveringToolbar from './components/hoveringToolbar';
import CommentInput from './components/commentInput';
import CommentList from './components/commentList';
import slateCommand from '../../../utils/slateCommand';
import { withHistory } from 'slate-history';
import LeafElement from './components/leafElement';
import SlateElement from './components';

function SlateEditor({ sharedType, provider }) {
  const editor = useMemo(() => {
    const e = withCustomerElement(
      withHistory(
        withReact(
          withCursors(withYjs(createEditor(), sharedType), provider.awareness, {
            data: {
              name: faker.person.fullName(),
              color: '#5E08A0',
            },
          }),
        ),
        { maxHistory: 50 },
      ),
    );
    const { normalizeNode } = e;
    e.normalizeNode = (entry, options) => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry, options);
      }

      Transforms.insertNodes(
        editor,
        { children: [{ text: '' }] },
        {
          at: [0],
        },
      );
    };
    return e;
  }, []);

  useEffect(() => {
    YjsEditor.connect(editor);
    return () => {
      YjsEditor.disconnect(editor);
    };
  }, [editor]);

  const currentSelectionRef = useRef();
  const [commentFor, setCommentFor] = useState('');
  const [comments, setComments] = useState([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const commentClickHandler = () => {
    if (!editor.selection || Range.isCollapsed(editor.selection)) return;
    setComments([]);
    slateCommand.commentAction(editor, 'addTemporaryMark', {
      setNewMarkSelection: (newSelection) => {
        currentSelectionRef.current = newSelection;
      },
    });
    setShowCommentInput(true);
    setCommentFor(window.getSelection().toString());
  };
  const onComment = (val) => {
    setShowCommentInput(false);
    slateCommand.commentAction(editor, val ? 'addMark' : 'removeMark', {
      comment: val,
      commentFor,
    });
  };

  const renderLeaf = (props) => (
    <LeafElement {...props} setComments={(val) => setComments(val)} />
  );

  const renderElement = (props) => <SlateElement {...props} />;

  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <Slate editor={editor} initialValue={[{ children: [{ text: '' }] }]}>
          {/* <Toolbar commentClickHandler={commentClickHandler} /> */}
          <HoveringToolbar
            showCommentInput={showCommentInput}
            commentClickHandler={commentClickHandler}
          />
          <CommentInput
            onOk={onComment}
            showCommentInput={showCommentInput}
            commentSelection={currentSelectionRef.current}
          />
          <CommentList comments={comments} />
          <Cursors>
            <Editable
              className={styles.editor}
              placeholder="Start typing here..."
              renderLeaf={renderLeaf}
              renderElement={renderElement}
            />
          </Cursors>
        </Slate>
      </div>
    </div>
  );
}

function CollaborativeEditor() {
  const room = useRoom();
  const [connected, setConnected] = useState(false);

  const yProvider = getYjsProviderForRoom(room);
  const yDoc = yProvider.getYDoc();
  const sharedType = yDoc.get('slate', Y.XmlText);

  useEffect(() => {
    yProvider.on('sync', setConnected);
    return () => {
      yProvider.off('sync', setConnected);
    };
  }, [room]);

  if (!connected || !sharedType) {
    return <div>Connecting...</div>;
  }

  return <SlateEditor sharedType={sharedType} provider={yProvider} />;
  // return <RichSlateEditor sharedType={sharedType} provider={yProvider} />;
}

export default function CollaborativeEditorWrapper() {
  return (
    <LiveblocksProvider publicApiKey={import.meta.env.VITE_LIVE_BLOCK_PUB_KEY}>
      <RoomProvider id="slate-collaborative-editor">
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          <CollaborativeEditor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
