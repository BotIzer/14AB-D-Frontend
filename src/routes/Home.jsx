import Navigation from "../components/Navigation";
import FriendList from "../components/FriendList";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyCarousel from "../components/MyCarousel";

export default function Home() {
  return (
    <>
      <Navigation />
      <Container fluid style={{ height: "200px" }}>
        <Row className="h-50">
          <Col className="border h-100" xs={4} sm={3} md={2}>
            <FriendList />
          </Col>
          <Col className="d-flex justify-content-center border h-100">
            <MyCarousel />
          </Col>
          <Col className="border h-100" xs={4} sm={3} md={2}>
            Third Column
          </Col>
        </Row>
      </Container>
    </>
  );
}
