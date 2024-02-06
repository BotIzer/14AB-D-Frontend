import { Button, FormGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TextEditor from "../components/TextEditor";
import Navigation from "../components/Navigation";
import axios from "../api/axios";
import { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function CreatePost() {
  const [imgList, setImgList] = useState([]);
  const AddToList = (text) => {
    if (text != null && text!= "") {
      return (<Dropdown.Item href={text}>{text}</Dropdown.Item>)
    }
  }
  const ClearAll = async () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      const editor = document.querySelector('.ql-editor');
    editor.innerHTML = '';
    const titles = document.querySelectorAll('.title');
    titles.forEach(title=> title.value = '');
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
        style={{ width: "40vw" }}
        justify
      >
        <Tab
          eventKey="post"
          title="Post"
          className="border w-50 mx-auto my-5 p-2"
        >
          <FormGroup className="p-2 w-100 h-100" controlId="textPost">
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control size="lg" type="text" placeholder="Title" className="mb-3 title" />
            <Form.Label className="secondary">Body</Form.Label>
            <TextEditor className="h-100"></TextEditor>
            <div className="d-flex justify-content-around my-3">
              <Button variant="outline-warning" size="lg">Post</Button>
              <Button variant="outline-danger" size="lg" onClick={()=>ClearAll()}>Clear all</Button>
            </div>
          </FormGroup>
        </Tab>
        <Tab
          eventKey="media"
          title="Media File"
          className="border w-50 mx-auto my-5 p-2"
        >
          <FormGroup className="p-2 w-100 h-100" controlId="filePost">
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Title"
              className="mb-3 title"
            />
            <div className="d-flex justify-content-around m-2 secondary">
              
              <DropdownButton data-bs-theme="dark" drop="down-centered" title="Added Image Links:" className="dropdown-button" >
                {imgList ? imgList : null}
              </DropdownButton>
              <Form.Control
                className="w-50"
                placeholder="paste Imgur link here"
                id="fileUpload"
              ></Form.Control>
              <Button
                variant="outline-warning"
                className="custom-button"
                onClick={() => setImgList([...imgList, AddToList(document.getElementById("fileUpload").value)])}
              >
                +
              </Button>
            </div>

            {/* <ul>
              {imgList ? imgList : null}
            </ul> */}

            <div className="d-flex justify-content-around my-3">
              <Button variant="outline-warning" size="lg">Post</Button>
              <Button variant="outline-danger" size="lg" onClick={()=>ClearAll()}>Clear all</Button>
            </div>
          </FormGroup>
        </Tab>
      </Tabs>
    </>
  );
}

export default CreatePost;
