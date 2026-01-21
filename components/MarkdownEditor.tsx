import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-md-editor/markdown.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  return (
    <MDEditor
      value={value}
      onChange={onChange}
      preview="live"
      hideToolbar={false}
      visibleDragBar={false}
    />
  );
};

export default MarkdownEditor;