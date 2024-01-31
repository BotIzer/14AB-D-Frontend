import React, {useMemo} from 'react';
import {useDropzone} from 'react-dropzone'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#e8cc80',
  borderStyle: 'dashed',
  backgroundColor: 'rgb(33, 37, 41)',
  color: '#e8cc80',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: 'yellow'
};

const acceptStyle = {
  borderColor: 'yellow'
};

const rejectStyle = {
  borderColor: 'red'
};

function DragAndDrop(props) {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone({accept: {'image/*': []}});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="container w-75">
      <div style={{cursor: 'pointer'}}>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside className='m-3'>
        <h5>Selected files:</h5>
        <ul>{files}</ul>
      </aside>
    </div>
      </div>
      
  );
}

export default DragAndDrop;