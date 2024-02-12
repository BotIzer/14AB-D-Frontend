import FriendList from "../components/FriendList";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyCarousel from "../components/MyCarousel";
import RecentList from "./RecentList";

function DesktopLayout() {
  return (
    <>
        <Row className="border h-100 m-5">
          <Col className="border p-0 h-100" sm={3} md={2}>
            <FriendList friends={["Sajtostaller","sajt","egyéb","tesztelés"]}/>
          </Col>
          <Col className="d-flex justify-content-center border p-0" style={{ height: "180px" }}>
            <MyCarousel />
          </Col>
          <Col className="border h-100" sm={3} md={2}>
            <RecentList/>
          </Col>
        </Row>
    </>
  );
}

export default DesktopLayout;
