import { Button, FormGroup, Row, Image, DropdownButton, DropdownItem, Container, Table, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Navigation from "../components/Navigation";
import axios from "../api/axios";
import { useNavigate, } from "react-router-dom";
import { useState } from "react";
import PostCard from "../components/PostCard"

function EditPost() {
  
  const [tagList, setTagList] = useState([]);
  const navigate = useNavigate();
  const preview = 
    {
      _id: {forum_id: 1,
         creator_id: 1,thread_id: 1},
      name: "Peview Post 1",
      content: "Content of Post 1",
      image_array: ["/src/assets/banner_test.jpg", "/src/assets/night-starry-sky-blue-shining-260nw-1585980592.png"],
      likes: 50,
      dislikes: 1,
      comment_count: 4,
      postDate: new Date(),
    }//TODO: Make previews dynamic
  const SaveChanges = async () => {
    const username = document.getElementById("username").value.trim();
    const profilePicture = document.getElementById("fileUpload").value.trim();
    if (username !== "" && profilePicture !== "") {
      // TODO: Display error if title/banner is empty!
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
    } else {
      return;
    }
  };
  const ClearAll = async () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      document.getElementById("title").value = "";
      document.getElementById("fileUpload").value = "";
    }
  };
  const DeleteProfile = async() => {
    if (confirm("Are you sure you want to delete your account?")) {
      const password = prompt("Please enter your password to confirm deletion")
      if (password === null || !password.trim()) {
        return;
      }
      await axios.delete(
        "/user",
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
            password: password
          },
          withCredentials: true,
        }
      );
      localStorage.clear()
      dispatchEvent(new Event('storage'))
      navigate('/')
    }

  }

  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="editPost"
        className="d-flex mb-5 mx-auto my-5 text-nowrap"
        style={{ width: "40vw", borderBottom: "none" }}
        justify
      >
        <Tab eventKey="editPost" title="Edit" className="border tab-size p-2">
          <FormGroup
            className="p-2 w-100 h-100 text-center"
            data-bs-theme="dark"
          >
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="title"
              className="mb-3 title text-center"
              id="title"
            />
          </FormGroup>
          <FormGroup data-bs-theme="dark" className="text-center">
            
          <Form.Label className="secondary">Tags</Form.Label>
            <div className="d-flex justify-content-around m-2 secondary">
                <DropdownButton
                  data-bs-theme="dark"
                  drop="down-centered"
                  title="Tags:"
                  className="dropdown-button"
                >
                  {tagList.map((item,index) => (
                    <DropdownItem key={index}>
                      {item}
                    </DropdownItem>
                  ))}
                </DropdownButton>
                <Form.Control
                  className="w-auto"
                  placeholder="enter categories"
                  id="fileUpload"
                ></Form.Control>
                <Button
                  variant="outline-warning"
                  className="custom-button"
                  onClick={() => AddTag()}
                >
                  Add
                </Button>
              </div>
          </FormGroup>

          <FormGroup data-bs-theme="dark" className="text-center">
            <Form.Label className="secondary">Image(es)</Form.Label>
            <div className="d-flex justify-content-around m-2 secondary">
                <DropdownButton
                  data-bs-theme="dark"
                  drop="down-centered"
                  title="Tags:"
                  className="dropdown-button"
                >
                  {tagList.map((item,index) => (
                    <DropdownItem key={index}>
                      {item}
                    </DropdownItem>
                  ))}
                </DropdownButton>
                <Form.Control
                  className="w-auto"
                  placeholder="enter categories"
                  id="fileUpload"
                ></Form.Control>
                <Button
                  variant="outline-warning"
                  className="custom-button"
                  onClick={() => AddTag()}
                >
                  Add
                </Button>
              </div>
          </FormGroup>
          <FormGroup className="text-center" data-bs-theme="dark">
            <Form.Label className="secondary">Description</Form.Label>
            <Form.Control
              size="lg"
              className="text-center"
              as="textarea"
              placeholder="enter description"
            ></Form.Control>
          </FormGroup>
          <div
            className="d-flex justify-content-around my-3"
            style={{ borderTop: "1px solid white" }}
          >
            <Button
              variant="outline-warning"
              size="lg"
              onClick={() =>
                SaveChanges()
              }
              className="mt-3"
            >
              Save
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => ClearAll()}
              /*TODO route back to Forum page, rename function*/
              className="mt-3"
            >
              Cancel
            </Button>
          </div>
        </Tab>
        <Tab
          eventKey="deletePost"
          title="Delete Post"
          className="tab-size p-2 text-center"
        >
          <Button
            variant="outline-danger"
            size="lg"
            onClick={() => DeleteProfile()} //TODO rename function
            className="mt-3"
          >
            Delete Post
          </Button>
        </Tab>
        <Tab eventKey="preview" title="Preview" className="tab-size">
            <PostCard post={preview}></PostCard>
        </Tab>
      </Tabs>
    </>
  );
}

export default EditPost;
