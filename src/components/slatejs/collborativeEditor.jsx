import { getYjsProviderForRoom } from '@liveblocks/yjs';
import { withYjs, YjsEditor, withCursors } from '@slate-yjs/core';
import { useEffect, useMemo, useState } from 'react';
import { createEditor, Editor, Transforms } from 'slate';
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

function SlateEditor({ sharedType, provider }) {
  const editor = useMemo(() => {
    const e = withCustomerElement(
      withReact(
        withCursors(withYjs(createEditor(), sharedType), provider.awareness, {
          data: {
            name: faker.person.fullName(),
            color: '#5E08A0',
          },
        }),
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

  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <Slate editor={editor} initialValue={[{ children: [{ text: '' }] }]}>
          {/* <Toolbar /> */}
          <Cursors>
            <Editable
              className={styles.editor}
              placeholder="Start typing here..."
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
