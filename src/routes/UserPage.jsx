import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "../api/axios";
import FriendList from "../components/FriendList";
import { useEffect, useState } from "react";
import ErrorPage from "../error-page";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { Button } from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function UserPage() {
  const location = useLocation();
  const { user } = useParams(location.pathname.split("/")[2]);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([])
  useEffect(() => {
    const GetPageDetails = async () => {
      try {
        await axios.get(
          `/user/${user}`,
          {},
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const response = await axios.get('/chats', {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        if (response.data.returnArray[0].name === user) {
          const chatData = await axios.get(`/chat/${response.data.returnArray[0]._id}/comments`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
          setMessages(chatData.data.comments)
        }
      } catch (err) {
        setError(err);
      }
    };
    GetPageDetails();
  }, [user]);

  if (error !== "") {
    return <ErrorPage errorStatus={error} />;
  }

  const dummyPosts = ["First post", "Lorem", "Ipsum"];
  const posts = dummyPosts.map((post) => (
    <Link key={post} className="list-group-item secondary">
      {post}
    </Link>
  ));

  return (
    <>
      <Navigation></Navigation>
      <Container>
        <Row  
          className="m-0 border" 
          style={{ height: "80vh" }}
        >
          <Col className="border h-100 p-0" xs={2}>
            <FriendList
              friends={["Markneu22", "Lajtaib", "BotIzer", "Placeholder"]}
            ></FriendList>
          </Col>
          <Col  
            className="border overflow-auto h-100"
          >
            <Row className="d-flex justify-content-center">
              <Image
                className="profileSize img-fluid"
                src="/src/assets/PFP_template.png"
                roundedCircle
                style={{float: "center"}}
              ></Image>
            </Row>
            <Row className="d-flex justify-content-center">
              <OverlayTrigger placement="right" overlay={<Tooltip>Message</Tooltip>}><Button className="text-center clear-button fs-2 primary" style={{width: "auto"}}>{user}</Button></OverlayTrigger>
              <p className="text-justify secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                tincidunt pellentesque pretium. Integer quis dolor mi. Aenean
                aliquet volutpat ante in luctus. Nullam sit amet risus varius,
                porttitor augue nec, dignissim nibh. Curabitur venenatis est
                eget dui malesuada, nec imperdiet velit porttitor. Sed eget
                justo mi. Nam faucibus sem a sodales consectetur. Maecenas
                dictum hendrerit erat eu interdum.
              </p>
            </Row>
            <Row className="m-0">
              <h4 className="text-center">Top posts</h4>
              <div
                data-bs-theme="dark"
                className="text-center list-group list-group-flush list-group-numbered"
              >
                {posts}
              </div>
            </Row>
          </Col>
          {user === JSON.parse(localStorage.getItem('userInfo')).username? null :<Col className="p-0 h-100" xs={4}> <ChatWindow chatData={messages}></ChatWindow></Col>}
        </Row>
      </Container>
    </>
  );
}
