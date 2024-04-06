import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Button,
  Container,
  Tab,
  Row,
  Col,
  Nav,
  Pagination,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Notifications() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [toggleTab, setToggleTab] = useState("requests");
  const location = useLocation();
  const [pageDetails, setPageDetails] = useState({
    currentPage: parseInt(location.search.split("page=")[1]) || 0,
    limit: parseInt(location.search.split("limit=")[1]) || 10,
  });
  useEffect(() => {
    const GetFriendRequests = async () => {
      const response = await axios.get("/user/friends/requests", {
        params: {
          page: pageDetails.currentPage,
          limit: pageDetails.limit,
        },
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      console.log(response.data.returnRequests);
      response.data.returnRequests.length !== 0
        ? setFriendRequests(response.data.returnRequests)
        : [];
    };
    GetFriendRequests();
  }, []);
  useEffect(() => {
    console.log(friendRequests);
  }, [friendRequests]);
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
    setFriendRequests((prevItems) =>
      prevItems.filter((friend) => friend !== requestCreator)
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
    setFriendRequests((prevItems) =>
      prevItems.filter((friend) => friend !== requestCreator)
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
    <div>
      <Row>
        <Link
          className="primary my-2"
          to={`/user/${friend}`}
          style={{ textDecoration: "none", width: "auto" }}
        >
          <b>
            <i>{friend}</i>
          </b>
        </Link>
      </Row>
      <Row className="border-bottom border-secondary">
        <Col className="tertiary">wants to be your friend!</Col>
        <Col>
          <Row className="px-2 justify-content-around">
            <Button style={{ width: "40%" }} variant="outline-warning px-0">
              Accept
            </Button>
            <Button style={{ width: "40%" }} variant="outline-danger px-0">
              Decline
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  ));

  //TODO connect to backend, make active page dynamic
  let pages = [];
  let pagesCount = 20;
  let active = 20;
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(
      <Pagination.Item key={i} active={i === active}>
        {i}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Navigation />
      <Container fluid data-bs-theme="dark">
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
                <Col>
                  <Row>
                    <Pagination className="justify-content-center p-0 m-0 custom-pagination">
                      <Pagination.First />
                      <Pagination.Prev />
                      {pages[active - 2]}
                      {pages[active - 1]}
                      {pages[active]}
                      <Pagination.Next />
                      <Pagination.Last />
                    </Pagination>{" "}
                    {/* TODO: Connect pagination to backend*/}
                  </Row>
                  <Row className="justify-content-center">
                    <Col className="text-center p-0" style={{maxWidth: "fit-content"}}>
                      <Nav.Item>
                        <Nav.Link
                          className="custom-tab secondary"
                          eventKey="requests"
                        >
                          Friend requests
                        </Nav.Link>
                      </Nav.Item>
                    </Col>
                    <Col className="text-center p-0" style={{maxWidth: "fit-content"}}>
                      <Nav.Item>
                        <Nav.Link
                          className="custom-tab secondary"
                          eventKey="notifications"
                        >
                          Notifications
                        </Nav.Link>
                      </Nav.Item>
                    </Col>
                  </Row>
                </Col>
              </Nav>
            </Row>
          </Col>
        </Tab.Container>
      </Container>
    </>
  );
}
