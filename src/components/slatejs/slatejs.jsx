import { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Element, Node, Point } from "slate";
import { Slate, withReact, Editable } from "slate-react";
import * as Y from "yjs";

import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";

const CustomerEditor = {
  isBoldMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },
  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });
    return !!match;
  },
  toggleBoldMark(editor) {
    const isActive = this.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, "bold");
    } else {
      Editor.addMark(editor, "bold", true);
    }
  },
  toggleCodeBlock(editor) {
    const isActive = this.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "code" },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) },
    );
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) },
    );
  },
};

const CodeElement = (props) => {
  return (
    <pre
      style={{ backgroundColor: "red", color: "#fff" }}
      {...props.attributes}
    >
      <code>{props.children}</code>
    </pre>
  );
};
const DefaultElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};
const LeafElement = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};

const serialize = (value) => {
  return value.map((n) => Node.string(n)).join("\n");
};

const deserialize = (string) => {
  return string.split("\n").map((line) => {
    return {
      children: [{ text: line }],
    };
  });
};

export default function Slatejs() {
  const [editor] = useState(() => withReact(createEditor()));

  useEffect(() => {
    const yDoc = new Y.Doc();
  }, []);

  const initialValue = useMemo(
    () =>
      // deserialize(localStorage.getItem("content-serialize") || ""),
      JSON.parse(
        localStorage.getItem("content") || [
          {
            type: "paragraph",
            children: [{ text: "A line of text in a paragraph." }],
          },
        ],
      ),
    [],
  );

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <LeafElement {...props} />;
  }, []);

  const handleEditorKeydown = (event) => {
    if (!event.ctrlKey) {
      return;
    }
    switch (event.key) {
      case "`":
        event.preventDefault();
        CustomerEditor.toggleCodeBlock(editor);
        break;
      case "b":
        console.log("emmmmmm");
        event.preventDefault();
        CustomerEditor.toggleBoldMark(editor);
        break;
    }
  };

  const resetNodes = (editor, { nodes, at }) => {
    const children = [...editor.children];
    children.forEach((node) => {
      editor.apply({ type: "remove_node", path: [0], node });
    });
    if (nodes) {
      const nodes = Node.isNode(nodes) ? [nodes] : nodes;
      nodes.forEach((node, index) => {
        editor.apply({ type: "insert_node", path: [index], node });
      });
    }
    const point = at && Point.isPoint(at) ? at : Editor.end(editor, []);
    if (point) {
      Transforms.select(editor, point);
    }
  };

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type,
        );
        console.log("editor value", value, editor);
        if (isAstChange) {
          const content = JSON.stringify(value);
          localStorage.setItem("content", content);
          localStorage.setItem("content-serialize", serialize(value));
        }
      }}
    >
      <div>
        <button
          onClick={(event) => {
            event.preventDefault();
            CustomerEditor.toggleBoldMark(editor);
          }}
        >
          Bold
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            CustomerEditor.toggleCodeBlock(editor);
          }}
        >
          Code Block
        </button>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleEditorKeydown}
      />
    </Slate>
  );
}
