import { Row, Col } from "react-bootstrap";
import MyCarousel from "./MyCarousel";
import FriendList from "./FriendList";
import RecentList from "./RecentList";

function MobileLayout() {
    return(
        <>
        <Row><MyCarousel images= {["/src/assets/react.svg","/src/assets/banner_test.jpg",
   "/src/assets/night-starry-sky-blue-shining-260nw-1585980592.png"]}/></Row>
        <Row className="m-2">
            <Col className="m-2 p-0"><FriendList friends={["Sajtostaller"]}/></Col>
            <Col className="m-2 border"><RecentList/></Col>
        </Row>
        </>
    )
}

export default MobileLayout;