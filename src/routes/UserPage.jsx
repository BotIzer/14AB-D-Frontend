import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "../api/axios";
import FriendList from "../components/FriendList";

export default function UserPage() {
  const location = useLocation();
  const {user} = useParams(location.pathname.split('/')[2]);
  const GetPageDetails = async ()  => { await axios.get(
    `/user/${user}`,
    {
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
    )};

  return (
    <>
      <Navigation></Navigation>
      <Container>
        <Row className="w-100">
          <Col className="border"><FriendList friends={["Markneu22", "Lajtaib", "BotIzer", "Placeholder"]}>asd</FriendList></Col>
          <Col className="border"></Col>
          <Col className="border"></Col>
        </Row>
      </Container>
    </>
  );
}
