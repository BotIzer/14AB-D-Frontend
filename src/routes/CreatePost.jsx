
import { Button, FormGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TextEditor from "../components/TextEditor";
import Navigation from "../components/Navigation";
import DragAndDrop from "../components/DragAndDrop";
import axios from "../api/axios";

function CreatePost() {
  const ClearAll = async () => {
    if (confirm("Are you sure you want to clear all fields?")) {
    const editor = document.querySelector('.ql-editor');
    editor.innerHTML = '';
    const title = document.querySelector('.title');
    title.value = '';
    }
  };
  const SendPost = async () => {
    // TODO: Check whether or not uses is logged in
    // Error handling for empty title/forum
    if(document.querySelector('.title').value === '' 
    || document.querySelector('.title').value.replace('/\sg', '').length){
      return;
    }
    await axios.post(
      '/thread/create',
      {
        forum_name: document.querySelector('.forum').value,
        name: document.querySelector('.title').value,
        content: document.querySelector('.ql-editor').innerHTML
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    )
  };
  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="post"
        className="d-flex mb-5 mx-auto my-5"
        style={{ width: "40vw"}}
        justify
      >
        <Tab eventKey="post" title="Post" className="border w-50 mx-auto my-5 p-2">
           <FormGroup className="p-2 w-100 h-100" controlId="textPost">
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control size="lg" type="text" placeholder="Title" className="mb-3 title" />
            {/* TODO: CHANGE THIS INTO A DROPDOWN MENU OF SUBSCRIBED FORUMS */}
            <Form.Label className="secondary">Forum</Form.Label>
            <Form.Control size="lg" type="text" placeholder="Forum" className="mb-3 forum" />
            <Form.Label className="secondary">Body</Form.Label>
            <TextEditor className='h-100'></TextEditor>
            <div className="d-flex justify-content-around my-3">
              <Button variant="outline-warning" size="lg" onClick={()=>SendPost()}>Post</Button>
              <Button variant="outline-danger" size="lg" onClick={()=>ClearAll()}>Clear all</Button>
            </div>
          </FormGroup>
        </Tab>
        <Tab eventKey="media" title="Media File" className="border w-50 mx-auto my-5 p-2">
          <FormGroup className="p-2 w-100 h-100" controlId="filePost">
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control size="lg" type="text" placeholder="Title" className="mb-3 title" />
            <div className="d-flex justify-content-center m-2 secondary">
              <DragAndDrop></DragAndDrop>
            </div>
            <div className="d-flex justify-content-around my-3">
              <Button variant="outline-warning" size="lg" onClick={()=>SendPost()}>Post</Button>
              <Button variant="outline-danger" size="lg" onClick={()=>ClearAll()}>Clear all</Button>
            </div>
          </FormGroup>
        </Tab>
        
      </Tabs>
    </>
  );
}

export default CreatePost;
