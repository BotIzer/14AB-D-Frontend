import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "../api/axios";
import FriendList from "../components/FriendList";
import Image from "react-bootstrap/Image";

export default function UserPage() {
  const location = useLocation();
  const { user } = useParams(location.pathname.split("/")[2]);
  const GetPageDetails = async () => {
    await axios.get(
      `/user/${user}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  
  return (
    <>
      <Navigation></Navigation>
      <Container>
        <Row className="justify-content-center">
          <Col className="border col-md-2">
            <FriendList
              friends={["Markneu22", "Lajtaib", "BotIzer", "Placeholder"]}
            ></FriendList>
          </Col>
          <Col className="border col-md-6">
            <Image
              src="/src/assets/PFP_template.png"
              roundedCircle
              fluid
              className="pfp mx-auto d-block"
            />
          </Col>
          <Col className="border col-md-2"></Col>
        </Row>
      </Container>
    </>
  );
}
