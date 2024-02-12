import Button from "react-bootstrap/Button";
import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FriendPopupActions from "../components/FriendPopupActions";
import { useState } from "react";
import ChatWindow from "../components/ChatWindow";

function Friends() {
  const friends = ["Markneu22", "Lajtaib", "BotIzer", "Placeholder"];
  const groups = ["Group1", "Group2", "Group3", "Group4"];
  const [showPopup, setShowPopup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const list = friends.map((friend) => (
    <Row key={friend} className="m-0">
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

  const groupList = groups.map((friend) => (
    <Row key={friend} className="m-0">
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
      <Row className="w-100 h-50 m-0">
        <Col
          data-bs-theme="dark"
          className="m-0 p-0 list-group list-group-flush overflow-auto text-center custom-border"
        >
          <Row className="m-0 pt-2">
            <h5>Friends</h5>
            <div className="border"></div>
            {list}
            </Row>
          <div className="border"></div>
          <Row className="m-0 pt-2">
            <h5>Groups</h5>
            <div className="border"></div>
            {groupList}
          </Row>
        </Col>
        <Col className="m-0 p-0">
          {showPopup ? <FriendPopupActions /> : null}
          {showChat ? <ChatWindow /> : null}
        </Col>
      </Row>
    </>
  );
}

//

export default Friends;
