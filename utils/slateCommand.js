import { faker } from '@faker-js/faker';
import { Editor, Element, Path, Range, Transforms } from 'slate';
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
  /**
   * @param {*} action tMark 临时标记 removeMark addMark
   * @param {*} values { selection, comment } 选区和评论
   * 文本节点 Text 只能添加属性，不能修改type或移除text，否则会丢失内容，所以使用 wrapNodes 而不是 setNodes
   * 选区本身是一个comment节点，使用Editor.nodes在选区内查找会返回选区内的comment节点
   */
  /**
   * * at 参数的匹配逻辑
   * at 参数指定的范围，比如editor.selection 并非严格限制查找范围，而是用于 * 确定查找的起始上下文 *
   * Editor.nodes会查找与该范围相关的所有符合条件的节点，包括：
   *    1，完全包含在范围内的节点
   *    2，部分重叠的节点
   *    3，包含该节点的祖先节点
   */
  commentSelection(editor, action, values = {}) {
    //#region
    // 判断当前选区节点是不是comment类型，是，就在之前数据上追加评论，不是，则将当前选区设置为comment节点
    // （但是根据at参数匹配逻辑，若选区包含，相交或被comment节点包含都会有结果
    // 那么 查找到的节点 和 选区 大概率Range不一致，就无法获取到前置数据
    const [node] = Editor.nodes(editor, {
      at: editor.selection,
      match: (n) => n.type === 'comment',
    });
    if (!node) {
      // 如果不是，将选区wrap成comment节点
      Transforms.wrapNodes(
        editor,
        {
          type: 'comment',
          comments: [],
        },
        { at: editor, selection, split: true },
      );
    } else {
      // 如果是, 比较选区和node的Range关系
      const [element, path] = node;
      const nodeRange = Editor.range(editor, path);
      const rangeEquals = Range.equals(editor.selection, nodeRange);
      if (rangeEquals) {
        // Range相同，则是在原基础上继续添加评论
        // 问题：当选区本身是comment节点，选区又包含comment节点，查找到的node会是包含的comment节点
      } else {
        // Range不同，将当前选区wrap成comment节点
      }
    }
    //#endregion
  },
  // 基于 commentSelection 做出修改
  // 查找所有comment节点，将Range和当前选区比较判断选区是否为comment节点
  // todo setNodes unsetNodes wrapNodes unwrapNodes要测试at的匹配问题
  setSelectionComment(editor) {
    const commentNodes = Editor.nodes(editor, {
      match: (n) => n.type === 'comment',
    });
    const commentNodesArray = Array.from(commentNodes);
    for (const [commentNode, commentNodePath] of commentNodesArray) {
      const commentNodeRange = editor.range(editor, commentNodePath);
      if (Range.equals(commentNodeRange, editor.selection)) {
        console.log(commentNode, editor.selection);
      }
    }
  },
  // addMark removeMark 只能操作当前选区，不能指定选区
  commentAction(editor, action, values = {}) {
    if (!editor.selection || Range.isCollapsed(editor.selection)) return;
    if (action === 'addTemporaryMark') {
      Editor.addMark(editor, 'withComment', true);
    }

    const { comment, commentFor, commentId } = values;
    if (action === 'removeMark') {
      // 有commentId删除单条评论
      if (commentId) {
        Editor.removeMark(editor, commentId);
        const marks = Editor.marks(editor);
        const hasComment = Object.keys(marks).some((key) => key.includes('c-'));
        if (!hasComment) {
          Editor.removeMark(editor, 'withComment');
        }
      } else {
        // 否则删除所有评论
        const marks = Editor.marks(editor);
        const commentKeys = Object.keys(marks).filter((key) =>
          key.includes('c-'),
        );
        if (commentKeys.length) {
          commentKeys.forEach((key) => {
            Editor.removeMark(editor, key);
          });
        }
        Editor.removeMark(editor, 'withComment');
      }
    }
    if (action === 'addMark') {
      // 对已经评论的叶子节点中的部分再进行评论，所选中的 部分 会带有父级叶子节点的评论，
      // todo 上述情况，是否需要评论各自独立不合并
      // todo 根据被评论的实时Range来判断 评论应该剔除还是合并
      // const marks = Editor.marks(editor, { at: editor.selection });
      // const [anchor, focus] = Range.edges(editor.selection);
      // console.log({ marks, anchor, focus });

      const timestamp = Date.now();
      Editor.addMark(editor, 'withComment', true);
      Editor.addMark(editor, `c-${timestamp}`, {
        id: `c-${timestamp}`,
        timestamp,
        username: faker.person.fullName(),
        comment,
        commentFor,
      });
    }
  },
  // done todo comment选区重叠时，comment各自独立
  // todo 被评论选区变化时，comment中记录信息同步变化，比如位置，内容等
  // done todo 选区addMark会覆盖选区内的同名mark
  toggleComment(editor, { comment, commentFor }) {
    const marks = Editor.marks(editor);
    // 为每一个评论单独设置属性，避免合并
    if (marks.withComment) {
      if (!comment || !commentFor) {
        Editor.removeMark(editor, 'withComment');
      } else {
        Editor.addMark(editor, `c-${Date.now()}`, {
          id: `c-${Date.now()}`,
          timestamp: Date.now(),
          username: faker.person.fullName(),
          comment,
          commentFor,
        });
      }
    } else {
      Editor.addMark(editor, 'withComment', true);
    }

    // comments数组为评论集合
    // const isActive = marks ? !!marks.comments : false;
    // if (isActive) {
    //   const comments = marks.comments;
    //   if (comment) {
    //     Editor.addMark(editor, 'comments', [
    //       // 重叠部分确实应该合并评论
    //       // ...comments.filter((item) => item.commentFor === commentFor),
    //       ...comments,
    //       {
    //         id: 'c-' + Date.now(),
    //         timestamp: Date.now(),
    //         username: faker.person.fullName(),
    //         comment,
    //         commentFor,
    //       },
    //     ]);
    //   } else {
    //     if (comments.length) {
    //       return;
    //     } else {
    //       Editor.removeMark(editor, 'comments');
    //     }
    //   }
    // } else {
    //   Editor.addMark(editor, 'comments', []);
    // }
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
  // 拖拽移动节点 type below 移动到目标节点之下 exchange 交换两节点位置
  moveNode(editor, dragNodePath, dropNodePath, type = 'below') {
    // 有效节点 且 起点终点不等
    if (
      !Path.isPath(dragNodePath) ||
      !Path.isPath(dropNodePath) ||
      Path.equals(dragNodePath, dropNodePath)
    ) {
      return;
    }
    // 同一层级才允许拖动
    if (!Path.equals(Path.parent(dragNodePath), Path.parent(dropNodePath))) {
      return;
    }
    if (dragNodePath[0] < dropNodePath[0]) {
      // 从前往后移动
      Transforms.moveNodes(editor, { at: dragNodePath, to: dropNodePath });
      if (type === 'exchange') {
        Transforms.moveNodes(editor, {
          at: [dropNodePath[0] - 1],
          to: dragNodePath,
        });
      }
    } else {
      // 从后往前移动但移动后位置与原位置一样
      if (dropNodePath[0] + 1 == dragNodePath[0]) {
        return;
      } else {
        // 不一样则
        Transforms.moveNodes(editor, {
          at: dragNodePath,
          to: [dropNodePath[0] + 1],
        });
        if (type === 'exchange') {
          Transforms.moveNodes(editor, { at: dropNodePath, to: dragNodePath });
        }
      }
    }
  },
};

export default slateCommand;
