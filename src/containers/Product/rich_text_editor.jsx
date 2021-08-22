import React, { Component } from 'react';
import { EditorState, convertToRaw ,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),//构建一个初始化的编辑器和内容
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  getRichText =() => {
    const {editorState}= this.state
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }
  setRichText = (html) => {
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          //wrapperClassName="demo-wrapper"//最外侧容器样式样式
          //editorClassName="demo-editor"//编辑区域样式'
          editorStyle={{
            border:'1px solid black',
            paddingLeft:'10px',
            lineHeight:'20px',
            minHeight:'200px'
          }}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}