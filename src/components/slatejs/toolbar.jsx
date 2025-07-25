import { useSlate } from "slate-react";
import styles from "./toolbar.module.css";
import { createPortal, Fragment } from "react-dom";

const tools = [
  {
    name: "Heading",
    action: "toggleHeading",
    children: [
      {
        name: "H1",
        action: "setHeading",
        value: "heading-one",
      },
      {
        name: "H2",
        action: "setHeading",
        value: "heading-two",
      },
      {
        name: "H3",
        action: "setHeading",
        value: "heading-three",
      },
    ],
  },
  {
    name: "Aa",
    action: "toggleTextStyle",
    children: [
      { name: "Bold", action: "toggleBoldMark" },
      { name: "Italic", action: "toggleItalicMark" },
      { name: "Underline", action: "toggleUnderlineMark" },
      { name: "Highlight", action: "toggleHighlightMark" },
      { name: "Strikethrough", action: "toggleStrikethroughMark" },
    ],
  },
  {
    name: "Align",
    action: "toggleAlign",
    children: [
      { name: "Left", action: "setAlign", value: "left" },
      { name: "Center", action: "setAlign", value: "center" },
      { name: "Right", action: "setAlign", value: "right" },
      { name: "Justify", action: "setAlign", value: "justify" },
    ],
  },
  {
    name: "Insert",
    action: "insert",
    children: [
      { name: "Link", action: "addLink" },
      { name: "Quote", action: "addQuote" },
      { name: "Image", action: "addImage" },
      { name: "List", action: "toggleList" },
      { name: "Code", action: "toggleCodeBlock" },
      { name: "Table", action: "addTable" },
      { name: "CheckList", action: "toggleCheckList" },
      // { name: "Insert Date", action: "insertDate" },
      // { name: "Insert Time", action: "insertTime" },
    ],
  },
  // { name: "Clear Formatting", action: "clearFormatting" },

  { name: "Comment", action: "addComment" },
];

export default function Toolbar() {
  const editor = useSlate();

  const handleToolItemAction = (tool) => {
    if (tool.children) {
      console.log(tool.children);
    } else {
    }
  };

  return (
    <div className={styles.toolbar}>
      {tools.map((tool) => (
        <div key={tool.name} className={styles.toolItem}>
          <button
            onClick={(event) => {
              event.preventDefault();
              console.log(`Action: ${tool.action}`);
              // CustomerEditor[tool.action](editor);
              handleToolItemAction(tool);
            }}
          >
            {tool.name}
          </button>
          {tool.children && (
            <div className={styles.toolItemOptions}>
              {tool.children.map((child) => (
                <div key={child.name}>{child.name}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
