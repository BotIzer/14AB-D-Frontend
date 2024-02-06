import { Button, FormGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TextEditor from "../components/TextEditor";
import Navigation from "../components/Navigation";
import axios from "../api/axios";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

function CreatePost() {
  // const [imgList, setImgList] = useState([]);
  // const AddToList = (text) => {
  //   if (text != null && text!= "") {
  //     return (<Dropdown.Item href={text}>{text}</Dropdown.Item>)
  //   }
  // }
  const SendPost = async () => {
    await axios.post(
      "/thread/create",
      {
        forum_name: "Chit-chat",
        name: document.querySelector(".title").value,
        content: document.querySelector(".ql-editor").innerText,
      },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
  };
  const ClearAll = async () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      const editor = document.querySelector(".ql-editor");
      editor.innerHTML = "";
      const titles = document.querySelectorAll(".title");
      titles.forEach((title) => (title.value = ""));
    }
    document.getElementById("fileUpload").value = "";
  };
  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="post"
        className="d-flex mb-5 mx-auto my-5 text-nowrap"
        style={{ width: "40vw", borderBottom: "none" }}
        justify
      >
        <Tab eventKey="post" title="Post" className="border tab-size p-2">
          <FormGroup className="p-2 w-100 h-100">
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
              <Button
                variant="outline-warning"
                size="lg"
                onClick={() => SendPost()}
              >
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
          className="border p-2 tab-size"
        >
          <FormGroup className="p-2 w-100 h-100">
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Title"
              className="mb-3 title"
            />
            <div className="d-flex justify-content-around m-2 secondary">
              <DropdownButton
                data-bs-theme="dark"
                drop="down-centered"
                title="Added Links:"
                className="dropdown-button"
              >
                {/* {imgList ? imgList : null} */}
              </DropdownButton>
              <Form.Control
                className="w-100"
                placeholder="paste Imgur link here"
                id="fileUpload"
              ></Form.Control>
              <Button
                variant="outline-warning"
                className="custom-button"
                // onClick={() => setImgList([...imgList, AddToList(document.getElementById("fileUpload").value)])}
              >
                Add
              </Button>
            </div>
            <div
              className="d-flex justify-content-around my-3"
              style={{ borderTop: "1px solid white" }}
            >
              <Button
                variant="outline-warning"
                size="lg"
                onClick={() => SendPost()}
                className="mt-3"
              >
                Post
              </Button>
              <Button
                variant="outline-danger"
                size="lg"
                onClick={() => ClearAll()}
                className="mt-3"
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
