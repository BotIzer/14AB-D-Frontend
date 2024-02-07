import Button from "react-bootstrap/Button";
import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FriendPopupActions from "../components/FriendPopupActions";
import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import {useParams,useLocation} from "react-router-dom"
import axios from "../api/axios";

function UserPage() {
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
  const friends = ["Markneu22", "Lajtaib", "BotIzer", "Placeholder"];
  const [showPopup, setShowPopup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const list = friends.map((friend) => (
    <Row key={friend}>
      <Button
        className=" secondary clear-button m-0"
        to={"/user/" + friend}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowPopup(!showPopup);
          setShowChat(false);
        }}
        onClick={(e) => {
          e.preventDefault();
          setShowChat(!showChat);
          setShowPopup(false);
        }}
      >
        {friend}
      </Button>
    </Row>
  ));
  return (
    <>
      <Navigation></Navigation>
      <Row className="w-100">
        <Col
          data-bs-theme="dark"
          className="list-group list-group-flush p-2 h-100 overflow-auto text-center custom-border"
        >
          {list}
        </Col>
        <Col>
          {showPopup ? <FriendPopupActions /> : null}
          {showChat ? <ChatWindow /> : null}
        </Col>
      </Row>
    </>
  );
}


export default UserPage;
