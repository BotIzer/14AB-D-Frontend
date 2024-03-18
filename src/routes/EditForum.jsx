import { Button, FormGroup, Row, Image, DropdownButton, DropdownItem, Container, Table, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Navigation from "../components/Navigation";
import axios from "../api/axios";
import { useNavigate, } from "react-router-dom";
import { useState } from "react";
import PostCard from "../components/PostCard"

function EditForum() {
  
  const [tagList, setTagList] = useState([]);
  const navigate = useNavigate();
  const preview = {
    banner: "/src/assets/banner_test.jpg",
    forum_name: "test Name",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat magni perspiciatis omnis, officia enim ex facere natus, mollitia ea nulla minus quae ducimus! Natus minima a placeat commodi eligendi. Odit."
    
  }; //Make previews dynamic
  const categoryPreview = [
    "gaming",
    "test",
    "e-sports",
    "question"
  ]
  const postsPreview = [
    {
      _id: {forum_id: 1,
         creator_id: 1,thread_id: 1},
      name: "Peview Post 1",
      content: "Content of Post 1",
      image_array: [],
      likes: 50,
      dislikes: 1,
      comment_count: 4,
      postDate: new Date(),
    },
    {
      _id: {forum_id: 2,
        creator_id: 2,thread_id: 2},
      name: "Peview Post 2",
      content: "Content of Post 2",
      image_array: [],
      likes: 25,
      dislikes: 1,
      comment_count: 4,
      postDate: new Date(),
    },
  ]
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
  //TODO you shouldnt be able to add empty string as tag
  const AddTag = async () => {
    await setTagList(prevItems=>[...prevItems,document.getElementById("fileUpload").value]);
    document.getElementById('fileUpload').value = ""
  }
/*data.forumData[0] && data.forumData[0] original code used for map*/
  const categoryList = categoryPreview.map((category)=>(
    <th
          style={{ fontSize: "small", borderWidth: "2px" }}
          key={category}
          className="text-center"
        >
          <i className="tertiary">{category}</i>
        </th>
  ))
  const postList = postsPreview.map((thread) => (
    <Row key={thread._id} className="w-100">
      <PostCard post={thread}></PostCard>
    </Row>
  ));

  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="editUser"
        className="d-flex mb-5 mx-auto my-5 text-nowrap"
        style={{ width: "40vw", borderBottom: "none" }}
        justify
      >
        <Tab eventKey="editUser" title="Edit" className="border tab-size p-2">
          <FormGroup
            className="p-2 w-100 h-100 text-center"
            data-bs-theme="dark"
          >
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="title"
              className="mb-3 title text-center"
              id="title"
            />
          </FormGroup>
          <FormGroup data-bs-theme="dark">
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
                  className="w-25 mx-5"
                  placeholder="paste Imgur link here"
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

          <FormGroup
            className="p-2 w-100 h-100 text-center"
            data-bs-theme="dark"
          >
            <Form.Label className="secondary">Banner</Form.Label>
            <Form.Control
              className="text-center mb-3"
              data-bs-theme="dark"
              placeholder="paste banner link here"
              id="fileUpload"
            ></Form.Control>
          </FormGroup>
          <FormGroup className="text-center" data-bs-theme="dark">
            <Form.Label className="secondary">Description</Form.Label>
            <Form.Control
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
              /*TODO route back to profile page, rename function*/
              className="mt-3"
            >
              Cancel
            </Button>
          </div>
        </Tab>
        <Tab
          eventKey="deleteForum"
          title="Delete Forum"
          className="tab-size p-2 text-center"
        >
          <Button
            variant="outline-danger"
            size="lg"
            onClick={() => DeleteProfile()} //TODO rename function
            className="mt-3"
          >
            Delete Forum
          </Button>
        </Tab>
        <Tab eventKey="preview" title="Preview" className="tab-size">
        <Container fluid>
        <Row
          className="p-2"
          style={{
            backgroundImage: `url(${preview.banner})`,
            backgroundSize: "cover",
            height: "20vh",
          }}
        >
          <h1 className="text-outline text-center m-auto">
            {/*data.forumData[0] &&*/ preview.forum_name}
          </h1>
        </Row>
        <Row className="no-padding-table">
          <Table responsive className="m-0" data-bs-theme="dark">
            <tbody>
              <tr>{categoryList}</tr>
            </tbody>
          </Table>
        </Row>
        <Row className="secondary">
          <div className="text-center p-5 custom-border">
            <i>{preview.description}</i>
          </div>
        </Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          {postList}
        </Col>
      </Container>
        </Tab>
      </Tabs>
    </>
  );
}

export default EditForum;
