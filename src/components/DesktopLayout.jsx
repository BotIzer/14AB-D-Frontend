import FriendList from "../components/FriendList";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyCarousel from "../components/MyCarousel";
import RecentList from "./RecentList";

function DesktopLayout() {
  return (
    <>
        <Row className="border h-100 m-5 p-0">
          <Col className="border p-0 h-100" sm={3} md={2}>
            <FriendList/>
          </Col>
          <Col className="d-flex justify-content-center border p-0" style={{ height: "180px" }}>
            <MyCarousel images={["/src/assets/react.svg",
     "/src/assets/banner_test.jpg",
     "/src/assets/night-starry-sky-blue-shining-260nw-1585980592.png"]}/>
          </Col>
          <Col className="border h-100 p-0" sm={3} md={2}>
            <RecentList/>
          </Col>
        </Row>
    </>
  );
}

export default DesktopLayout;
