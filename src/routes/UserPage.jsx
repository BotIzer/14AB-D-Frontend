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

export default function UserPage() {
  const location = useLocation();
  const { user } = useParams(location.pathname.split("/")[2]);
  const [error, setError] = useState("");

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
      <Container fluid className="border p-0">
        <Row style={{ width: "100%" }} className="m-0">
          <Col className="border w-25">
            <FriendList
              friends={["Markneu22", "Lajtaib", "BotIzer", "Placeholder"]}
            ></FriendList>
          </Col>
          <Col
            className="border w-50" /*onClick={(e) => e.preventDefault()}> Show Chat window in right column */
          >
            <Row>
              <Image
                className=""
                src="/src/assets/PFP_template.png"
                fluid
                roundedCircle
              ></Image>
            </Row>
            <Row>
              <h2 className="text-center">{user}</h2>
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
          <Col className="border w-25 p-0"> <ChatWindow></ChatWindow></Col>
        </Row>
      </Container>
    </>
  );
}
