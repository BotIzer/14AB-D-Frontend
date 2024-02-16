import { Row, Col } from "react-bootstrap";
import MyCarousel from "./MyCarousel";
import FriendList from "./FriendList";
import RecentList from "./RecentList";

function MobileLayout() {
    return(
        <>
        <Row><MyCarousel/></Row>
        <Row className="m-2">
            <Col className="m-2 p-0"><FriendList friends={["Sajtostaller"]}/></Col>
            <Col className="m-2 border"><RecentList/></Col>
        </Row>
        </>
    )
}

export default MobileLayout;