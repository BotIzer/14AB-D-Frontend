import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Friends() {
  const friends = ["Markneu22", "Lajtaib", "BotIzer", "Placeholder"];

  const list = friends.map((friend) => (
    <Row key={friend}>
      <Link className="list-group-item secondary" to={"/friends/" + friend}>
        {friend}
      </Link>
    </Row>
  ));

  return (
    <>
      <Navigation></Navigation>
      <Row>
        <Col
          style={{ maxWidth: "400px", height: "100vh" }}
          data-bs-theme="dark"
          className="list-group list-group-flush overflow-auto custom-border text-center"
        >
          {list}
        </Col>
      </Row>
    </>
  );
}

export default Friends;
