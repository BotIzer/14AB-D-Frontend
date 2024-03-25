import { Button, FormGroup, Row, Image, DropdownButton, DropdownItem, Container, Table, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Navigation from "../components/Navigation";
import axios from "../api/axios";
import { useLocation, useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard"

function EditForum() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tagList, setTagList] = useState([]);
  const [previewData, setPreviewData] = useState({
    title: "",
    tags: [],
    banner: "",
    description: "",
  });
  const [displayError, setDisplayError] = useState(false)
  useEffect(() => {
    const GetPreviewData = async () => {
      const response = await axios.get(`/forum/${location.pathname.split("/")[3]}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setPreviewData({
        title: response.data[0].forum_name,
        tags: response.data[0].tags,
        banner: response.data[0].banner,
        description: response.data[0].description,
      });
      document.getElementById("title").value = response.data[0].forum_name;
      document.getElementById('banner').value = response.data[0].banner;
      document.getElementById("description").value = response.data[0].description;
    }
    GetPreviewData();
  },[location.pathname])
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
    const title = document.getElementById("title").value.trim();
    // const tags = document.getElementById("tags").value.trim();
    const banner = document.getElementById('banner').value.trim();
    const description = document.getElementById("description").value.trim();
    const forumId = location.pathname.split("/")[3]
    console.log(forumId)
    if (title !== "" && banner !== "") {
      // TODO: Display error if title/banner is empty!
      await axios.put(
        `/forum/${forumId}`,
        {
          forum_name: title,
          banner: banner,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      navigate(`/forums/${title}/${forumId}`)
    }
    else{
      setDisplayError(true)
    }
  };
  const Cancel = async () => {
    if (confirm("Are you sure you want to stop editing?")) {
      navigate(`/forums/${location.pathname.split('/')[2]}/${location.pathname.split('/')[3]}`)
    }
  };
  const DeleteForum = async() => {
    if (confirm("Are you sure you want to delete this forum?")) {
      await axios.delete(
        "/forum",
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
            forumname: location.pathname.split('/')[2] 
          },
          withCredentials: true,
        }
      );
      navigate('/')
    }

  }
  const AddTag = async () => {
    if(document.getElementById('tagUpload').value.trim() !== ''){
      await setTagList(prevItems=>[...prevItems,document.getElementById("tagUpload").value]);
      document.getElementById('tagUpload').value = ""
    }
  }
  const HandleSelect = (key) =>{
    if(key === 'preview'){
      setPreviewData({
        title: document.getElementById("title").value,
        tags: tagList,
        banner: document.getElementById('banner').value,
        description: document.getElementById("description").value,
      })
    }
  }
  const categoryList = categoryPreview.map((category)=>(
    <th
          style={{ fontSize: "small", borderWidth: "2px" }}
          key={category}
          className="text-center"
        >
          <i className="tertiary">{category}</i>
        </th>
  ))
  // const postList = postsPreview.map((thread) => (
  //   <Row key={thread._id} className="w-100">
  //     <PostCard post={thread}></PostCard>
  //   </Row>
  // ));
const postList = <p>postList</p>
  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="editUser"
        className="d-flex mb-5 mx-auto my-5 text-nowrap"
        style={{ width: "40vw", borderBottom: "none" }}
        onSelect={HandleSelect}
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
              {/* TODO: fill it with tags dynamically */}
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
                  placeholder="add tags here"
                  id="tagUpload"
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
              id="banner"
            ></Form.Control>
            <OverlayTrigger placement="right" overlay={<Tooltip>Note: banners with an aspect ratio of 6:1 work best, other pictures may appear stretched or shrunk</Tooltip>}>
              <Image className="hover-filter-gold" src="/src/assets/icons/info.png"></Image>
            </OverlayTrigger>
          </FormGroup>
          <FormGroup className="text-center" data-bs-theme="dark">
            <Form.Label className="secondary">Description</Form.Label>
            <Form.Control
              className="text-center"
              as="textarea"
              placeholder="enter description"
              id="description"
            ></Form.Control>
            {displayError ? <div><span className="invalid">Title or Banner picture field is empty!</span></div> : null}
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
              onClick={() => Cancel()}
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
            onClick={() => DeleteForum()} //TODO rename function
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
            backgroundImage: `url(${previewData.banner})`,
            backgroundSize: "cover",
            height: "20vh",
          }}
        >
          <h1 className="text-outline text-center m-auto">
            {previewData.title}
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
            <i>{previewData.description}</i>
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