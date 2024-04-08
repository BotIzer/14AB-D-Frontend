import Navigation from "../components/Navigation";
import { Col, Row, Container, Table, Button, Image, Pagination } from "react-bootstrap";
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
          authorization: `${localStorage.getItem('token') !== null ? 
          `Bearer ${localstorage.getItem('token')}` : 'Bearer null'}`
        },
        withCredentials: true,
      }),
      axios.get(`/forum/getAllThreads/${forum_id}`,
        {headers: {
          'Content-Type': 'application/json',
          authorization: `${localStorage.getItem('token') !== null ? 
          `Bearer ${localstorage.getItem('token')}` : 'Bearer null'}`
        },
      })])
      setData({
        forumData: forumData.data,
        threads: threads.data
      });
  }
     GetForumData()
    //  TODO: fix this ESLint error
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
  const categoryList = data.forumData[0] && data.forumData[0].tags.map((category)=>(
    <th
          style={{ fontSize: "small", borderWidth: "2px" }}
          key={category}
          className="text-center"
        >
          <i className="tertiary">{category}</i>
        </th>
  ))
  const postList = data.threads && data.threads.map((thread) => (
    <Row key={thread._id.thread_id} className="my-3 p-3">
      <PostCard post={thread}></PostCard>
    </Row>
  ));

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
          className="clear-button fixed-bottom-right mb-4"
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
            backgroundImage: data.forumData[0] && `url(${data.forumData[0].banner})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            height: "20vh",
          }}
        >
          <h1 className="text-outline text-center m-auto">
            {data.forumData[0] && data.forumData[0].forum_name}
          </h1>
          <Button className="position-absolute end-0 rounded-pill clear-button" 
                style={{width: 'auto', height: 'auto'}} 
                onClick={()=>navigate(`/editforum/${encodeURIComponent(data.forumData[0].forum_name)}/${data.forumData[0]._id.forum_id}`)}>
                  <Image src="/src/assets/icons/edit.png" className="hover-filter-gold"/>
          </Button>
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
            <i>{data.forumData[0] && data.forumData[0].description}</i>
          </div>
        </Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          {postList}
        </Col>
        <Pagination className="justify-content-center custom-pagination">
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

export default Forum;
