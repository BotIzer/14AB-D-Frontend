import Navigation from "../components/Navigation";
import { Col, Row, Container, Table, Button } from "react-bootstrap";
import PostCard from "../components/PostCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { useEffect, useState } from "react";

function Forum() {
  const navigate = useNavigate();
  const location = useLocation();
  const forum_id = useParams(location.pathname.split('/')[2]).forumId
  const [data,setData] = useState({
    forumData: [],
    threads: []
  })
  useEffect(()=>{
    const GetForumData = async () => {
      const [forumData, threads] =  await Promise.all([
        axios.get(`/forum/${forum_id}`,
        {headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }),
      axios.get(`/forum/getAllThreads/${forum_id}`,
        {headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      })])
      setData({
        forumData: forumData.data,
        threads: threads.data
      });
  }
     GetForumData()
  },[])


  const dummyForum = {
    id: 1,
    title: "Dummy Forum",
    description:
      "This is a dummy forum for testing, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet ullam doloribus temporibus vitae saepe, nobis doloremque, commodi autem et adipisci, id rerum blanditiis at eaque. Itaque dolorem obcaecati aspernatur esse",
    banner: "/src/assets/banner_test.jpg",
    categories: ["gaming", "sports"],
    posts: [
      {
        id: 1,
        title: "Post 1",
        content: "Content of post 1",
        comment_count: 1,
        likes: 1,
        dislikes: 0,
        postDate: "2021-06-28T14:30:00.000Z",
      },
      {
        id: 2,
        title: "Post 2",
        content: "Content of post 2",
        comment_count: 22,
        likes: 100,
        dislikes: 2000,
        postDate: "2021-06-28T14:30:00.000Z",
      },
    ],
  };
  // fix this worthless piece of garbage
  const categoryList = data.forumData[0] && data.forumData[0].tags.map((category)=>(
    <th
          style={{ fontSize: "small", borderWidth: "2px" }}
          key={category}
          className="text-center"
        >
          <i className="tertiary">{category}</i>
        </th>
  ))
  const postList = data.threads.map((thread) => (
    <Row key={thread._id} className="w-100">
      <PostCard post={thread}></PostCard>
    </Row>
  ));
  return (
    <>
      <Navigation></Navigation>
      <Container fluid>
        <Button
          className="m-5 clear-button fixed-bottom-right"
          style={{ backgroundColor: "#343a40" }}
          onClick={() => navigate(`/forums/${data.forumData[0].forum_name}/createpost/`)}
        >
          <img
            className="hover-filter-gold"
            src="/src/assets/icons/add_forum.png"
            alt="add forum"
          />
        </Button>
        <Row
          className="p-2"
          style={{
            backgroundImage: `url(${dummyForum.banner})`,
            backgroundSize: "cover",
            height: "15vh",
          }}
        >
          <h1 className="text-outline text-center m-auto">
            {data.forumData[0] && data.forumData[0].forum_name}
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
            <i>{dummyForum.description}</i>
          </div>
        </Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          {postList}
        </Col>
      </Container>
    </>
  );
}

export default Forum;
