import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Button, Container, Tab, Row, Col, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Notifications() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [toggleTab, setToggleTab] = useState("requests");
  const location = useLocation();
  const [currentPage,setCurrentPage] = useState(parseInt(location.search.split('page=')[1]) || 0);
  const [limit, setLimit] = useState(parseInt(location.search.split('limit=')[1]) || 10);
  useEffect(() => {
    const GetFriendRequests = async () => {
      const response = await axios.get("/user/friends/requests", {
        params: {
          page: currentPage,
          limit: limit
        },
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      console.log(response.data.returnRequests)
      response.data.returnRequests.length !== 0
        ? setFriendRequests(response.data.returnRequests)
        : ["empty"];
    };
    GetFriendRequests();
  }, []);
  useEffect(()=>{
    console.log(friendRequests)
  },[friendRequests])
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
    setFriendRequests(prevItems => prevItems.filter(friend => friend !== requestCreator))
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
    setFriendRequests(prevItems => prevItems.filter(friend => friend !== requestCreator))
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
