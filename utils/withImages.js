import { insertImage, isImageUrl } from './helper';

export default function withImages(editor) {
  const { insertData, isVoid } = editor;
  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };
  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const { files } = data;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const [mime] = file.type.split('/');
        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            insertImage(editor, url);
          });
          reader.readAsDataURL(file);
        }
      });
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };
  return editor;
}
