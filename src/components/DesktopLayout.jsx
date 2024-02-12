import FriendList from "../components/FriendList";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyCarousel from "../components/MyCarousel";

function DesktopLayout() {
  return (
    <>
        <Row className="h-50">
          <Col className="border h-100" sm={3} md={2}>
            <FriendList friends={["Sajtostaller","sajt","egyéb","tesztelés"]}/>
          </Col>
          <Col className="d-flex justify-content-center border h-100">
            <MyCarousel />
          </Col>
          <Col className="border h-100" sm={3} md={2}>
            Third Column
          </Col>
        </Row>
    </>
  );
}

export default DesktopLayout;
