import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Button, Container, Tab, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Notifications() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [toggleTab, setToggleTab] = useState("requests");
  useEffect(() => {
    const GetFriendRequests = async () => {
      const response = await axios.get("/user/friends/requests", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      response.data.requests.length !== 0
        ? setFriendRequests(response.data.requests)
        : null;
    };
    GetFriendRequests();
  }, []);
  const AcceptFriendRequest = async (requestCreator) => {
    await axios.post(
      `/acceptFriendRequest/${requestCreator}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
  };
  const DeclineFriendRequest = async (requestCreator) => {
    await axios.post(
      `/declineFriendRequest/${requestCreator}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
  };
  // const listItems = friendRequests.map((friend) => (
  //   <div key={friend}>
  //     <p>{friend}</p>
  //     <Button onClick={() => AcceptFriendRequest(friend)}>Accept</Button>
  //     <Button onClick={() => DeclineFriendRequest(friend)}>Decline</Button>
  //   </div>
  // ));

  const requestsList = friendRequests.map((friend) => (
    <Row className="m-2 p-2 border-bottom border-secondary" key={friend}>
      <Col xs={6} md={10} className="align-self-center tertiary">
        <Link
          className="primary"
          to={`/user/${friend}`}
          style={{ textDecoration: "none" }}
        >
          <b>
            <i>{friend}</i>
          </b>{" "}
        </Link>
        wants to be your friend!
      </Col>
      <Col xs={3} md={1}>
        <Button
          variant="outline-warning"
          onClick={() => AcceptFriendRequest(friend)}
        >
          Accept
        </Button>
      </Col>
      <Col xs={3} md={1}>
        <Button
          variant="outline-danger"
          onClick={() => DeclineFriendRequest(friend)}
        >
          Decline
        </Button>
      </Col>
    </Row>
  ));

  return (
    <>
      <Navigation />
      <Container fluid>
        <Tab.Container id="left-tabs-example" defaultActiveKey="requests">
          <Col>
            <Row>
              <Tab.Content>
                <Tab.Pane eventKey="requests">{requestsList}</Tab.Pane>
                <Tab.Pane eventKey="notifications">
                  Second tab content {/*TODO notification list*/}
                </Tab.Pane>
              </Tab.Content>
            </Row>
            <Row>
              <Nav
                className="fixed-bottom justify-content-center"
                style={{ backgroundColor: "#343a40" }}
              >
                <Nav.Item>
                  <Nav.Link
                    className="custom-tab secondary"
                    eventKey="requests"
                  >
                    Friend requests
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className="custom-tab secondary"
                    eventKey="notifications"
                  >
                    Notifications
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>
          </Col>
        </Tab.Container>
      </Container>
    </>
  );
}
