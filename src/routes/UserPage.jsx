import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useParams, useLocation} from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "../api/axios";
import FriendList from "../components/FriendList";
import { useEffect, useState } from "react";
import ErrorPage from "../error-page";

export default function UserPage() {
  
  const location = useLocation();
  const {user} = useParams(location.pathname.split('/')[2]);
  const [error, setError] = useState('');
asd

  useEffect(()=> {
    const GetPageDetails = async ()  => { 
      try { await axios.get(
       `/user/${user}`,
       {
       },
       {
         headers: { 'Content-Type': 'application/json' }
       },
       )}
     catch(err){
       setError(err);
     }};
     GetPageDetails();
  },[user]);
  
  if (error !== '') {
    return <ErrorPage errorStatus={error}/>
  }
  return (
    <>
      <Navigation></Navigation>
      <Container>
        <Row className="w-100">
          <Col className="border"><FriendList friends={["Markneu22", "Lajtaib", "BotIzer", "Placeholder"]}></FriendList></Col>
          <Col className="border"></Col>
          <Col className="border"></Col>
        </Row>
      </Container>
    </>
  );
}