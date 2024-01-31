import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function TextEditor() {
  const [value, setValue] = useState('');

  return <ReactQuill style={{color: "white"}} className='text-editor' theme="snow" x value={value} onChange={setValue} />;
}

export default TextEditor;