import {
  reactKeys,
  ProseMirror,
  ProseMirrorDoc,
} from '@handlewithcare/react-prosemirror';
import { baseKeymap } from 'prosemirror-commands';
import { exampleSetup } from 'prosemirror-example-setup';
import { keymap } from 'prosemirror-keymap';
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
// import { EditorView } from 'prosemirror-view';
import { Fragment } from 'react';
import {
  initProseMirrorDoc,
  redo,
  undo,
  yCursorPlugin,
  ySyncPlugin,
  yUndoPluginKey,
} from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const roomname = `prosemirror-react-demo-${new Date().toLocaleDateString(
  'en-CA',
)}`;
const ydoc = new Y.Doc();
const provider = new WebsocketProvider(
  'wss://demos.yjs.dev/ws',
  roomname,
  ydoc,
);

export default function ProseMirrorColl() {
  const yXmlFragment = ydoc.getXmlFragment('prosemirror');
  const { doc, mapping } = initProseMirrorDoc(yXmlFragment, schema);
  const defaultState = EditorState.create({
    doc,
    schema,
    plugins: [
      ySyncPlugin(yXmlFragment, { mapping }),
      yCursorPlugin(provider.awareness),
      yUndoPluginKey(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
      }),
      keymap(baseKeymap),
      reactKeys(),
    ].concat(
      exampleSetup({
        schema,
      }),
    ),
  });
  window.example = { ydoc, provider, yXmlFragment, pmDoc: doc };
  return (
    <Fragment>
      <ProseMirror defaultState={defaultState}>
        <ProseMirrorDoc />
      </ProseMirror>
    </Fragment>
  );
}
