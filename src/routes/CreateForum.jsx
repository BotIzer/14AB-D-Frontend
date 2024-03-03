import { Button, DropdownItem, FormGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TextEditor from "../components/TextEditor";
import Navigation from "../components/Navigation";
import axios from "../api/axios";
// import { useState } from "react";
// import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useEffect, useState } from "react";

function CreateForum() {
  const [imgList, setImgList] = useState([]); 
  // const AddToList = (text) => {
  //   if (text != null && text!= "") {
  //     return (<Dropdown.Item href={text}>{text}</Dropdown.Item>)
  //   }
  // }
  useEffect(()=>{
    
  },[imgList])
  // const SendPost = async () => {
  //   await axios.post(
  //     "/thread",
  //     {
  //       forum_name: "Chit-chat",
  //       name: document.querySelector(".title").value,
  //       content: document.querySelector(".ql-editor").innerText,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       withCredentials: true,
  //     }
  //   );
  // }; //TODO make this post a forum
  const ClearAll = async () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      const editor = document.querySelector(".ql-editor");
      editor.innerHTML = "";
      const titles = document.querySelectorAll(".title");
      titles.forEach((title) => (title.value = ""));
      document.getElementById("fileUpload").value = "";
    }
  };
  const AddImage = () => {
    setImgList(prevItems=>[...prevItems,{url: "alma"}]);
    console.log("alma");
    //TODO make this not add static item, limit items to only one (forum can only have one banner at a time)
  }
  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="forum"
        className="d-flex mb-5 mx-auto my-5 text-nowrap"
        style={{ width: "40vw", borderBottom: "none" }}
        justify
      >
        <Tab eventKey="forum" title="Create forum" className="border tab-size p-2">
          <FormGroup className="p-2 w-100 h-100" data-bs-theme="dark">
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Title"
              className="mb-3 title"
            />
            <Form.Label className="secondary">Description</Form.Label>
            <TextEditor className="h-100"></TextEditor>
          </FormGroup>
        
          <FormGroup className="p-2 w-100 h-100">
            <div className="d-flex justify-content-around m-2 secondary">
              <DropdownButton
                data-bs-theme="dark"
                drop="down-centered"
                title="Banner link:"
                className="dropdown-button"
              >
                {imgList.map((item,index) => (
                  <DropdownItem key={index}>
                    {item.url}
                  </DropdownItem>
                ))}
              </DropdownButton>
              <Form.Control
                data-bs-theme="dark"
                className="w-100 mx-5"
                placeholder="paste banner link here"
                id="fileUpload"
              ></Form.Control>
              <Button
                variant="outline-warning"
                className="custom-button"
                onClick={() => AddImage()}
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
                onClick={() => SendPost()} /*TODO Rename this function */
                className="mt-3"
              >
                Create
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

export default CreateForum;
