import Navigation from "../components/Navigation";
import FriendList from "../components/FriendList";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyCarousel from "../components/MyCarousel";
import axios from "../api/axios";

export default function Home() {
    const GetUserData = async () => {
       const response = await axios.get(
            `/user/${JSON.parse(localStorage.getItem('userInfo')).username}`,
            {
              email: email.toLowerCase(),
              password: pwd,
              username: user,
            },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: false,
            }
          )
          console.log(response)
        return "hello"
    }
  return (
    <>
      <Navigation />
      <Container fluid style={{ height: "800px" }}>
        <p>{GetUserData}</p>
      </Container>
    </>
  );
}
