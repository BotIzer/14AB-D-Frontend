import { Col, Row, Container, Button, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import ForumCard from "../components/ForumCard";
import axios from "../api/axios";

function Forums() {
  const navigate = useNavigate();
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

  return (
    <>
      <Navigation></Navigation>
      <Container fluid>
      <Button className="m-5 clear-button position-fixed bottom-0 end-0" style={{backgroundColor: '#343a40'}} 
      onClick={() => navigate("/createforum/")}><img className="hover-filter-gold" src="/src/assets/icons/add_forum.png"alt="add forum" /></Button> 
        <Row className="m-5">
          <h1 className="text-center">
            Popular forums
          </h1>
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
