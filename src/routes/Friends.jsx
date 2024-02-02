import Button from "react-bootstrap/Button";
import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FriendPopupActions from "../components/FriendPopupActions";
import { useState } from "react";

function Friends() {
  const friends = ["Markneu22", "Lajtaib", "BotIzer", "Placeholder"];
  const [showPopup, setShowPopup] = useState(false);
  const list = friends.map((friend) => (
    <Row key={friend}>
      <Button
        className=" secondary clear-button m-0"
        to={"/user/" + friend}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowPopup(!showPopup);
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
        <Col>{showPopup ? <FriendPopupActions /> : null}</Col>
      </Row>
    </>
  );
}

export default Friends;
