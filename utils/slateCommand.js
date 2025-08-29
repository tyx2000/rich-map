import { faker } from '@faker-js/faker';
import { Editor, Element, Range, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';

const slateCommand = {
  isButtonActive(editor) {
    const [button] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'button',
    });
    return !!button;
  },
  wrapButton(editor) {
    if (this.isButtonActive(editor)) {
      this.unwrapButton(editor);
    }
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const button = {
      type: 'button',
      children: isCollapsed ? [{ text: 'edit me' }] : [],
    };
    if (isCollapsed) {
      Transforms.insertNodes(editor, button);
    } else {
      Transforms.wrapNodes(editor, button, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  },
  unwrapButton(editor) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'button',
    });
  },
  insertButton(editor) {
    if (editor.selection) {
      this.wrapButton(editor);
    }
  },
  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'code',
    });
    return !!match;
  },
  toggleCodeBlock(editor) {
    const isActive = this.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) },
    );
  },
  undoOrRedo(editor, action) {
    const isHistoryEditor = HistoryEditor.isHistoryEditor(editor);
    if (isHistoryEditor) {
      const { undos, redos } = editor.history;
      if (action === 'undo' && undos.length > 0) {
        editor.undo();
      }
      if (action === 'redo' && redos.length > 0) {
        editor.redo();
      }
    }
  },
  // 获取目标节点
  getHighestTargetNodes(editor) {
    const nodes = [];
    if (editor.selection) {
      const start = Range.start(editor.selection),
        end = Range.end(editor.selection);
      if (Range.isCollapsed(editor.selection)) {
        const [node] = Editor.nodes(editor, {
          at: start.path,
          match: (n) => !Editor.isEditor(n) && Element.isElement(n),
          mode: 'highest',
        });
        if (node) {
          const [, nodePath] = node;
          nodes.push(nodePath);
        }
      } else {
        const [startMatchNode] = Editor.nodes(editor, {
          at: start.path,
          match: (n) => !Editor.isEditor(n) && Element.isElement(n),
          mode: 'highest',
        });
        const [endMatchNode] = Editor.nodes(editor, {
          at: end.path,
          match: (n) => !Editor.isEditor(n) && Element.isElement(n),
          mode: 'highest',
        });
        if (startMatchNode && endMatchNode) {
          const [, startNodePath] = startMatchNode;
          const [, endNodePath] = endMatchNode;
          for (let i = startNodePath[0]; i <= endNodePath[0]; i++) {
            nodes.push([i]);
          }
        }
      }
    }
    return nodes;
  },
  // 将选区设置成heading，将选区涉及到的所有节点都设置成heading而不仅是选区部分
  toggleHeader(editor, value) {
    const targetNodes = this.getHighestTargetNodes(editor);
    if (targetNodes.length > 0) {
      targetNodes.forEach((path) => {
        Transforms.setNodes(
          editor,
          { type: 'heading', level: value },
          { at: path },
        );
      });
    } else {
      return;
    }
  },
  // addmark 在当前选区的叶子文本节点或任何 editor.markableVoid() 节点上添加自定义属性
  toggleMark(editor, formatLabel, formatValue) {
    const marks = Editor.marks(editor);
    const isActive = marks ? marks[formatLabel] === formatValue : false;
    if (isActive) {
      Editor.removeMark(editor, formatLabel);
    } else {
      Editor.addMark(editor, formatLabel, formatValue);
    }
  },
  // 设置align, 将当前光标所在node或是选区涉及到的node全部设置align而不是部分
  alignNodes(editor, value) {
    const targetNodes = this.getHighestTargetNodes(editor);
    if (targetNodes.length > 0) {
      targetNodes.forEach((path) => {
        Transforms.setNodes(editor, { align: value }, { at: path });
      });
    } else {
      return;
    }
  },
  // 触发或还原list checklist
  // todo 将节点整体转换成 list checklist 且遵循原节点的样式
  // todo 带顺序标识的 listitem 标识怎么递增，删除 listitem 标识自动变化
  toggleList(editor, name, value) {
    const targetNodes = this.getHighestTargetNodes(editor);
    if (targetNodes.length > 0) {
      targetNodes.forEach((path) => {
        const [node] = Editor.node(editor, path);
        if (node) {
          // 节点是 list checklist
          if (node.type === name) {
            // 设置 list
            if (value) {
              Transforms.setNodes(
                editor,
                {
                  type: name,
                  prefix: value,
                },
                { at: path },
              );
            } else {
              // 设置checklist
              Transforms.setNodes(
                editor,
                { type: node.prevType || 'paragraph' },
                { at: path },
              );
            }
          } else {
            // 从其他类型转换成 list checklist
            Transforms.setNodes(
              editor,
              {
                type: name,
                prevType: node.type,
                prefix: node.prefix || value,
              },
              { at: path },
            );
          }
        }
      });
    } else {
      return;
    }
  },
  // 为选区添加或移除 链接
  toggleLink(editor, url) {
    if (!editor.selection) return;
    const [node] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
    if (node) {
      Transforms.unwrapNodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
      });
    } else {
      const isCollapsed = Range.isCollapsed(editor.selection);
      const link = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : [],
      };
      if (isCollapsed) {
        Transforms.insertNodes(editor, link);
      } else {
        Transforms.wrapNodes(editor, link, { split: true });
        Transforms.collapse(editor, { edge: 'end' });
      }
    }
  },
  // todo comment选区重叠时，comment合并而不是覆盖
  // todo comment选区完全包含已经comment的选区，被包含的选区comment会被覆盖
  // todo 选区被删除时，评论同步删除
  // todo 测试了腾讯文档，评论选区包含或是重叠均没有覆盖，各自独立 emmmmmmmmm
  toggleComment(editor, { comment, commentFor }) {
    const marks = Editor.marks(editor);
    const isActive = marks ? !!marks.comments : false;
    if (isActive) {
      const comments = marks.comments;
      if (comment) {
        Editor.addMark(editor, 'comments', [
          // 重叠部分缺失应该合并评论
          // ...comments.filter((item) => item.commentFor === commentFor),
          ...comments,
          {
            id: 'c-' + Date.now(),
            timestamp: Date.now(),
            username: faker.person.fullName(),
            comment,
            commentFor,
          },
        ]);
      } else {
        if (comments.length) {
          return;
        } else {
          Editor.removeMark(editor, 'comments');
        }
      }
    } else {
      Editor.addMark(editor, 'comments', []);
    }
  },
  // 跳出当前类型节点，在相邻处添加 paragraph
  insertNewParagraphAtNext(editor) {
    if (!editor.selection) return;
    const paragraph = {
      type: 'paragraph',
      children: [{ text: '' }],
    };
    const end = Range.end(editor.selection);
    const currentPath = end.path[0];
    Transforms.insertNodes(editor, paragraph, {
      at: [currentPath + 1],
      select: true,
    });
  },
};

export default slateCommand;
