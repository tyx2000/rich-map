import { Node, Transforms } from 'slate';
import isUrl from 'is-url';
import imageExt from 'image-extensions';

export function serialize(value) {
  return value.map((n) => Node.string(n)).join('\n');
}

export function deserialize(string) {
  return string.split('\n').map((line) => {
    return {
      children: [{ type: line }],
    };
  });
}

export function isImageUrl(url) {
  if (!url) {
    return false;
  }
  if (!isUrl(url)) {
    return false;
  }
  const ext = new URL(url).pathname.split('.').pop();
  return imageExt.includes(ext);
}

export function insertImage(editor, url) {
  const text = { text: '' };
  const image = { type: 'image', url, children: [text] };
  Transforms.insertNodes(editor, image);
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }],
  });
}

export function insertEditableVoid(editor) {
  const voidNode = {
    type: 'editableVoid',
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, voidNode);
}

export const getSelectionOffset = () => {
  const domSelection = window.getSelection();
  const domRange = domSelection.getRangeAt(0);
  const offset = domRange.getBoundingClientRect();
  return offset;
};

export const makeElementVisiable = (element) => {
  const [screenWidth, screenHeight] = [window.innerWidth, window.innerHeight];
  const { width, height, top, right, bottom, left } =
    element.getBoundingClientRect();
  const [topOut, rightOut, bottomOut, leftOut] = [
    top < 10,
    screenWidth - right < 10,
    screenHeight - bottom < 10,
    left < 10,
  ];
  if (rightOut) {
    element.style.left = `${screenWidth - width - 10}px`;
  }
  if (leftOut) {
    element.style.left = '10px';
  }
  if (bottomOut) {
    element.style.top = `${screenHeight - height - 10}px`;
  }
};
