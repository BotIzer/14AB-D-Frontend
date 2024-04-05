import { Col, Row, Container, Button, Pagination } from "react-bootstrap";
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
      
      const userResponse = await axios.get(`/user/${JSON.parse(localStorage.getItem('userInfo')).username}`,{
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true 
      })
      const updatedForums = response.data.forums.map(forum => {
        return {
          ...forum,
          isSubscribed: Object.values(forum.users).some(user => user.user_id === userResponse.data.user._id)
        };
      });
      setForums(updatedForums);
    };
    GetForums();
  }, []);
  useEffect(()=>{
    console.log(forums)
  },[forums])
  const listForums = forums.map((forum) => (
    <Row className="m-3 p-0" key={forum.forum_name}>
      <ForumCard forum={forum}></ForumCard>
    </Row>
  ));

  //TODO connect to backend, make active page dynamic
  let pages = []
  let pagesCount = 20
  let active = 20 
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(
    <Pagination.Item key={i} active={i === active}>
      {i}
    </Pagination.Item>
    ) 
  }

  return (
    <>
      <Navigation></Navigation>
      <Container data-bs-theme="dark" fluid>
        <Button
          className="mb-5 clear-button fixed-bottom-right"
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
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            {listForums}
          </Col>
        </Row>
          <Pagination className="justify-content-center">
            <Pagination.First/>
            <Pagination.Prev/>
            {pages[active - 2]}
            {pages[active - 1]}
            {pages[active]}
            <Pagination.Next/>
            <Pagination.Last/>
          </Pagination> {/* TODO: Connect pagination to backend*/}
      </Container>
    </>
  );
}

export default Forums;
