import Button from "react-bootstrap/Button";
import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FriendPopupActions from "../components/FriendPopupActions";
import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import {useParams} from "react-router-dom"
import FriendList from "../components/FriendList";

function UserPage() {
  const {user} = useParams()
  const friends = ["Markneu22", "Lajtaib", "BotIzer", "Placeholder"];


  return (
    <>
      <Navigation></Navigation>
      <Container>
        <Row className="w-100">
          <Col className="border"><FriendList friends={friends}></FriendList></Col>
          <Col className="border"></Col>
          <Col className="border"></Col>
        </Row>
      </Container>
    </>
  );
}


export default UserPage;
