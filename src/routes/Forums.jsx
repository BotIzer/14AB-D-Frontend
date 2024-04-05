import { Col, Row, Container, Button, Pagination } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import ForumCard from "../components/ForumCard";
import axios from "../api/axios";
import { useEffect, useState } from "react";

function Forums() {
  const navigate = useNavigate();
  const location = useLocation();
  const [forums, setForums] = useState([]);
  const [pageData, setPageData] = useState({currentPage: parseInt(new URLSearchParams(location.search).get('page')) || 1, 
  pageCount: parseInt(new URLSearchParams(location.search).get('page')) || 1})

  const handlePaginationClick = (pageNumber) =>{
    setPageData(prevState => ({
      ...prevState,
      currentPage: pageNumber
    }));
    navigate(`/forums?page=${pageNumber}`);
  } 

  useEffect(() => {
    const GetForums = async () => {
      const response = await axios.get(`/forum?page=${pageData.currentPage-1}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setPageData({currentPage: pageData.currentPage, pageCount: response.data.pagesCount})
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
      console.log("nice")
    };
    GetForums();
  }, [location]);
  useEffect(()=>{
    console.log(pageData.currentPage)
  },[pageData])
  const listForums = forums.map((forum) => (
    <Row className="m-3 p-0" key={forum.forum_name}>
      <ForumCard forum={forum}></ForumCard>
    </Row>
  ));

  //TODO connect to backend, make active page dynamic
  let pages = []
  for (let i = 1; i <= pageData.pageCount; i++) {
    pages.push(
    <Pagination.Item onClick={()=>setPageData({...pageData, currentPage: i,})} key={i} active={i === pageData.currentPage}>
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
            <Pagination.First onClick={()=>handlePaginationClick(1)}/>
            <Pagination.Prev onClick={()=>handlePaginationClick(pageData.currentPage-1 <= 0 ? pageData.pageCount : pageData.currentPage-1)}/>
            {pages}
            <Pagination.Next onClick={()=>handlePaginationClick(pageData.currentPage+1 > pageData.pageCount ? 1 : pageData.currentPage+1)}/>
            <Pagination.Last onClick={()=>handlePaginationClick(pageData.pageCount)}/>
          </Pagination> {/* TODO: Connect pagination to backend*/}
      </Container>
    </>
  );
}

export default Forums;
