import Navigation from "../components/Navigation";
import { Col, Row, Container, Table } from "react-bootstrap";
import PostCard from "../components/PostCard";

function Forum() {
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
        postDate: "2021-06-28T14:30:00.000Z",
      },
      {
        id: 2,
        title: "Post 2",
        content: "Content of post 2",
        postDate: "2021-06-28T14:30:00.000Z",
      },
    ],
  };
  const categoryList = dummyForum.categories.map((category) => (
    <th
      style={{ fontSize: "small", borderWidth: "2px" }}
      key={category}
      className="text-center"
    >
      <i className="tertiary">{category}</i>
    </th>
  ));

  const postList = dummyForum.posts.map((post) => (
    <Row key={post.id}>
      <PostCard post={post}></PostCard>
    </Row>
  ));

  return (
    <>
      <Navigation></Navigation>
      <Container fluid>
        <Row
          className="p-2"
          style={{
            backgroundImage: `url(${dummyForum.banner})`,
            backgroundSize: "cover",
            height: "15vh",
          }}
        >
          <h1 className="text-outline text-center m-auto">
            {dummyForum.title}
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
