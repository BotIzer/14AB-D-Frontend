import { Col, Row, Container, Button, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import ForumCard from "../components/ForumCard";
import axios from "../api/axios";
import { useEffect, useState } from "react";

function Forums() {
  const navigate = useNavigate();
  const [forums, setForums] = useState([]);
  useEffect(() => {
    const GetForums = async () => {
      const response = await axios.get("/forum", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setForums(response.data);
      console.log(response.data[0]);
    };
    GetForums();
  }, []);

  const listForums = forums.map((forum) => (
    <Row className="m-3 p-0" key={forum.forum_name}>
      <ForumCard forum={forum}></ForumCard>
    </Row>
  ));

  return (
    <>
      <Navigation></Navigation>
      <Container fluid>
        <Button
          className="m-5 clear-button fixed-bottom-right"
          style={{ backgroundColor: "#343a40" }}
          onClick={() => navigate("/createforum")}
        >
          <img
            className="hover-filter-gold"
            src="/src/assets/icons/add_forum.png"
            alt="add forum"
          />
        </Button>
        <Row className="m-5">
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
