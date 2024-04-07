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
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Notifications() {
  const navigate = useNavigate()
  const location = useLocation();
  const [friendRequests, setFriendRequests] = useState([]);
  const [toggleTab, setToggleTab] = useState("requests");
  const [notifications,setNotifications] = useState({})
  const [pageData, setPageData] = useState({currentPage: parseInt(new URLSearchParams(location.search).get('page')) || 0, 
  pageCount: parseInt(new URLSearchParams(location.search).get('page')) || 1})
  const [removeId, setRemoveId] = useState("")
  const [seenNotifications, setSeenNotifications] = useState([])

  useEffect(() => {
    const GetFriendRequests = async () => {
      const response = await axios.get(`/user/friends/requests?page=${pageData.currentPage}`, {
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
    const GetNotifications = async() => {
      const response = await axios.get('/notification',
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    })
    setPageData({currentPage: pageData.currentPage, pageCount: response.data.notificationsPageCount})
    console.log(response.data)
    setNotifications(response.data)
    const seenNotifications = response.data.notifications
    .filter(notification => notification.seen)
    .map(notification => notification.id);
    setSeenNotifications(seenNotifications);
    }
    GetFriendRequests();
    GetNotifications();
  }, [location]);
  useEffect(()=>{
    if(notifications.notifications && notifications.notifications.length <= 0 && pageData.pageCount != 0){
      setPageData({
        currentPage: pageData.currentPage-1 <= 0 ? 0 : pageData.currentPage,
        pageCount: pageData.pageCount - 1 <= 0 ? 0 : pageData.pageCount
        
      });
      navigate(`/notifications?page=${pageData.currentPage-1 <= 0 ? 0 : pageData.currentPage-1}`)
    }
  },[notifications])
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
  const SendSeen = async (seenNotification) =>{
    setSeenNotifications([...seenNotifications, seenNotification]);
    await axios.put(`/notification/${seenNotification}`,
  {
    seen: true
  },
  {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
  })
  }
  {console.log(notifications)}
  let listItems = notifications.notifications && notifications.notifications.map((notification) => (
    <div key={notification.id}>
      <p>{notification.text}</p>
      <Button disabled={seenNotifications.includes(notification.id)} onClick={() => SendSeen(notification.id)}>Seen</Button>
      <Button onClick={() => DeleteNotification(notification.id)}>Delete</Button>
    </div>
  ));

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
  const DeleteNotification = async(deletionId) =>{
    await axios.delete(
      `/notification/${deletionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    )
    setRemoveId(deletionId)
    setNotifications(prevNotifications => {
      return {
          ...prevNotifications,
          notifications: prevNotifications.notifications.filter(notification => notification.id !== deletionId)
      };
  });
  }
  const handlePaginationClick = (pageNumber) =>{
    setPageData(prevState => ({
      ...prevState,
      currentPage: pageNumber
    }));
    navigate(`/notifications?page=${pageNumber}`);
  } 
  //TODO connect to backend, make active page dynamic
  let pages = []
  for (let i = 1; i <= pageData.pageCount; i++) {
    pages.push(
    <Pagination.Item onClick={()=>handlePaginationClick(i)} key={i} active={i === pageData.currentPage}>
      {i}
    </Pagination.Item>
    ) 
  }

  
  return (
    <>
      <Navigation removeId={removeId}/>
      <Container fluid data-bs-theme="dark">
        <Tab.Container id="left-tabs-example" defaultActiveKey="requests">
          <Col>
            <Row>
              <Tab.Content>
                <Tab.Pane eventKey="requests">
                  {requestsList && requestsList.length <= 0 ? "No friend requests." : requestsList}
                  <Row>
                    <Pagination className="justify-content-center custom-pagination fixed-bottom mb-5">
                      <Pagination.First onClick={()=>handlePaginationClick(1)}/>
                      <Pagination.Prev onClick={()=>handlePaginationClick(pageData.currentPage-1 <= 0 ? pageData.pageCount : pageData.currentPage-1)}/>
                        {pages}
                      <Pagination.Next onClick={()=>handlePaginationClick(pageData.currentPage+1 > pageData.pageCount ? 1 : pageData.currentPage+1)}/>
                      <Pagination.Last onClick={()=>handlePaginationClick(pageData.pageCount)}/>
                    </Pagination> {/* TODO: Connect pagination to backend*/}
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="notifications">
                  {listItems && listItems.length <= 0 ? "No notifications." : listItems}
                  <Row>
                    <Pagination className="justify-content-center custom-pagination fixed-bottom mb-5">
                      <Pagination.First onClick={()=>handlePaginationClick(1)}/>
                      <Pagination.Prev onClick={()=>handlePaginationClick(pageData.currentPage-1 <= 0 ? pageData.pageCount : pageData.currentPage-1)}/>
                        {pages}
                      <Pagination.Next onClick={()=>handlePaginationClick(pageData.currentPage+1 > pageData.pageCount ? 1 : pageData.currentPage+1)}/>
                      <Pagination.Last onClick={()=>handlePaginationClick(pageData.pageCount)}/>
                    </Pagination> {/* TODO: Connect pagination to backend*/}
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Row>
            <Row>
              <Nav
                className="p-0 fixed-bottom justify-content-center"
                style={{ backgroundColor: "#343a40" }}
              >
                <Col>
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
