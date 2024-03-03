import { Button, DropdownItem, FormGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
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
  const SendPost = async () => {
    const title = document.getElementById('title').value.trim();
    const banner = document.getElementById('fileUpload').value.trim();
    if (title !== "" && banner !== "") {
      await axios.post(
        "/forum",
        {
          forum_name: title,
          banner: banner,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
    }
    else{
      return;
    }
    
  };
  const ClearAll = async () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      document.getElementById("title").value = "";
      document.getElementById("fileUpload").value = "";
    }
  };
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
              id="title"
            />
          </FormGroup>
        
          <FormGroup className="p-2 w-100 h-100">
            <div className="d-flex justify-content-around m-2 secondary">
              <Form.Control
                data-bs-theme="dark"
                className="w-100 mx-5"
                placeholder="paste banner link here"
                id="fileUpload"
              ></Form.Control>
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
