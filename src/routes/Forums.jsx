import { Col, Row, Container, Button, Form, FormGroup } from "react-bootstrap";
import Navigation from "../components/Navigation";
import ForumCard from "../components/ForumCard";
import axios from "../api/axios";

function Forums() {
  const loadedForums = [
    {
      title: "DummyTitle",
      description: "DummyDescription",
      categories: [
        "gaming",
        "sports",
        "music",
        "gaming",
        "sports",
        "music",
        "gaming",
        "sports",
        "music",
        "gaming",
        "sports",
        "music",
        "gaming",
        "sports",
        "music",
        "gaming",
        "sports",
        "music",
        "gaming",
        "sports",
        "music",
        "gaming",
        "sports",
        "music",
      ],
      banner: "/src/assets/banner_test.jpg",
      topPost: {
        title: "Post Title",
        content: "Post Content",
      },
      lastUpdated: "2021-06-28T14:30:00.000Z",
    },
    {
      title: "DummyTitle2",
      description: "DummyDescription2",
      categories: ["gaming", "sports", "music"],
      banner: "/src/assets/banner_test.jpg",
      topPost: {
        title: "Post Title2",
        content: "Post Content2",
      },
      lastUpdated: "2021-06-28T14:30:00.000Z",
    },
    {
      title: "DummyTitle3",
      description: "DummyDescription3",
      categories: ["gaming", "sports", "music"],
      banner: "/src/assets/banner_test.jpg",
      topPost: {
        title: "Post Title3",
        content: "Post Content3",
      },
      lastUpdated: "2021-06-28T14:30:00.000Z",
    },
  ];
  const listForums = loadedForums.map((forum) => (
    <Row className="m-3 p-0" key={forum.title}>
      <ForumCard forum={forum}></ForumCard>
    </Row>
    )
    );
  // placeholder function
  const createForum = async () =>{
    await axios.post(
      "/forum",
      {
        forum_name: document.getElementById('forumName').value,
        banner: document.getElementById('bannerLink').value
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("HAHAA");
  }
  return (
    <>
      <Navigation></Navigation>
      <Container fluid>
        <Row className="m-5">
          {/* All of this is placeholder for the real form control and stuff
          that Boti will insert here */}
          <FormGroup>
        <div className="row m-0">
          <Form.Control
            id="forumName"
            placeholder="Forum Name"
            className="w-75"
            autoFocus
          ></Form.Control>
          <Form.Control
            id="bannerLink"
            placeholder="Forum Banner"
            className="w-75"
            autoFocus
          ></Form.Control>
          <Button
            variant="outline-warning"
            className="custom-button w-25 p-0 overflow-hidden"
            type="submit"
            onClick={() => createForum()}
          >
            Create Forum
          </Button>
          {/* https://i.imgur.com/BUEk7j4.mp4 */}
        </div>
      </FormGroup>
          <h1 className="text-center">Popular forums</h1>
        </Row>
        <Row className="border justify-content-center">
          <Col xs={12} md={6}>
            {listForums}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Forums;
