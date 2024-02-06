import { Button, FormGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TextEditor from "../components/TextEditor";
import Navigation from "../components/Navigation";
import { useState } from "react";
import { link } from "fs";

function CreatePost() {
  const [imgList, setImgList] = useState([]);
  const AddToList = () => {
    const text = document.getElementById("fileUpload").value;
    return (<li>{text}</li>)
  }
  const ClearAll = async () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      const editor = document.querySelector(".ql-editor");
      editor.innerHTML = "";
      const titles = document.querySelectorAll(".title");
      titles.forEach((title) => (title.value = ""));
    }
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
            <Form.Control
              size="lg"
              type="text"
              placeholder="Title"
              className="mb-3 title"
            />
            <Form.Label className="secondary">Body</Form.Label>
            <TextEditor className="h-100"></TextEditor>
            <div className="d-flex justify-content-around my-3">
              <Button variant="outline-warning" size="lg">
                Post
              </Button>
              <Button
                variant="outline-danger"
                size="lg"
                onClick={() => ClearAll()}
              >
                Clear all
              </Button>
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
            <div className="d-flex justify-content-center m-2 secondary border">
              <Form.Control
                className="w-50"
                placeholder="paste Imgur link here"
                id="fileUpload"
              ></Form.Control>
              <Button
                variant="outline-warning"
                className="custom-button"
                onClick={() => setImgList([...imgList, AddToList()])}
              >
                +
              </Button>
            </div>

            <ul>
              {imgList ? imgList : null}
            </ul>

            <div className="d-flex justify-content-around my-3">
              <Button variant="outline-warning" size="lg">
                Post
              </Button>
              <Button
                variant="outline-danger"
                size="lg"
                onClick={() => ClearAll()}
              >
                Clear all
              </Button>
            </div>
          </FormGroup>
        </Tab>
      </Tabs>
    </>
  );
}

export default CreatePost;
