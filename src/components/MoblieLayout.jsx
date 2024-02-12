import { Row, Col } from "react-bootstrap";
import MyCarousel from "./MyCarousel";
import FriendList from "./FriendList";

function MobileLayout() {
    return(
        <>
        <Row><MyCarousel/></Row>
        <Row>
            <Col><FriendList friends={["Sajtostaller","sajt","egyéb","tesztelés"]}/></Col>
            <Col>Third Column</Col>
        </Row>
        </>
    )
}

export default MobileLayout;