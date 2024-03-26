import { Button, FormGroup, DropdownButton, Container, Row, Col, Table, Image, Form, Tab,  Tabs, OverlayTrigger, Tooltip, DropdownItem } from "react-bootstrap";
import Navigation from "../components/Navigation";
import axios from "../api/axios";
import { useState, } from "react";
import PostCard from "../components/PostCard"
import { useNavigate } from "react-router-dom";

function CreateForum() {

  const navigate = useNavigate()
  const [previewData, setPreviewData] = useState({
    title: "",
    tags: [],
    banner: "",
    description: "",
  });
  const [displayError, setDisplayError] = useState(false);

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
  // const categoryList = categoryPreview.map((category)=>(
  //   <th
  //         style={{ fontSize: "small", borderWidth: "2px" }}
  //         key={category}
  //         className="text-center"
  //       >
  //         <i className="tertiary">{category}</i>
  //       </th>
  // ))
  // const postList = postsPreview.map((thread) => (
  //   <Row key={thread._id} className="w-100">
  //     <PostCard post={thread}></PostCard>
  //   </Row>
  // ));
  const postList = <p>postList</p>


  const CreateForum = async () => {
    const title = document.getElementById('title').value.trim();
    const banner = document.getElementById('banner').value.trim();
    if (title !== "" && banner !== "") {
      const response = await axios.post(
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
      navigate(`/forums/${title}/${response.data.forumId}`)
    }
    else{
      setDisplayError(true);
    }
  };
  const Cancel = async () => {
    if (confirm("Are you sure you want to cancel forum creation?")) {
      navigate('/forums')
    }
  };
  const HandleSelect = async (eventKey) => {
    if(eventKey === 'preview') {
      const title = document.getElementById('title').value.trim();
      const banner = document.getElementById('banner').value.trim();
      const description = document.getElementById('description').value.trim();
  
      setPreviewData({
        title: title,
        tags: [],
        banner: banner,
        description: description
      });
    }
  };
  const AddTag = () => {
    const previousPrevData = previewData
    //TODO: Fix this
    setPreviewData({title: previousPrevData.title, tags: prevItems=>[...prevItems, document.getElementById("tagUpload").value], 
    banner: previousPrevData.banner, description: previousPrevData.description})
  }
  
  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="forum"
        className="d-flex mb-5 mx-auto my-5 text-nowrap"
        style={{ width: "40vw", borderBottom: "none" }}
        justify
        onSelect={HandleSelect}
      >
        <Tab eventKey="forum" title="Create forum" className="border tab-size p-2">
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
                  {previewData.tags.map((item,index) => (
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
              defaultValue={"default"}
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
            {displayError ? <div><span className="invalid">Title or Banner field is empty!</span></div> : null}
          </FormGroup>
          <div
            className="d-flex justify-content-around my-3"
            style={{ borderTop: "1px solid white" }}
          >
            <Button
              variant="outline-warning"
              size="lg"
              onClick={() =>
                CreateForum()
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
              <tr>{previewData.tags}</tr>
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

export default CreateForum;
