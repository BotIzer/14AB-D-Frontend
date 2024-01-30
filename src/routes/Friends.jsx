import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Friends() {
    const friends = [
        "Markneu22",
        "Lajtaib",
        "BotIzer",
        "Placeholder"
    ];

    const list = friends.map(friend => (
    <Row key={friend}>
        <Link
        to={"/friends/" + friend}
        >
        {friend}
        </Link>
    </Row>))

    
    return (
        <>
        <Navigation></Navigation>
        <Row>
            <Col>{list}</Col>
        </Row>
        </>
    )
}

export default Friends;