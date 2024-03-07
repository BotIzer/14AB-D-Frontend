import Navigation from "../components/Navigation";
import Container from "react-bootstrap/Container";
import DesktopLayout from "../components/DesktopLayout";
import MobileLayout from "../components/MoblieLayout";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Button } from "react-bootstrap";

export default function Notifications() {
  const [friendRequests, setFriendRequests] = useState([])
  useEffect(() => {

    const GetFriendRequests = async () => {
      const response = await axios.get(
        '/user/friendRequests',
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      response.data.requests.length !== 0 ? setFriendRequests(response.data.requests) : null
    }
    GetFriendRequests()
  },[])
  const AcceptFriendRequest = async (requestCreator) => {
        await axios.post(
        `/acceptFriendRequest/${requestCreator}`,
        {
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )

  }
  const DeclineFriendRequest = async (requestCreator) => {
        await axios.post(
        `/acceptFriendRequest/${requestCreator}`,
        {
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
  }
  const listItems = false ? friendRequests.map((friend) => (
    <div key={friend}>
    <p>{friend}</p>
    <Button
    onClick={()=> AcceptFriendRequest(friend)}
    >
      Accept
    </Button>
    <Button
    onClick={()=> DeclineFriendRequest(friend)}
    >
      Decline
    </Button>
    </div>

  )): null;
  return (
    <>
      <Navigation />
      <Container fluid style={{ height: "800px" }}>
        <div className="sm-hidden">
          <DesktopLayout></DesktopLayout>
        </div>
        <div className="lg-hidden">
          <MobileLayout></MobileLayout>
        </div>
        <p>Friend requests</p>
      {listItems}
      </Container>
      
    </>
  );
}
