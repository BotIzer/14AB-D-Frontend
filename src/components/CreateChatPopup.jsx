import {Row, Col, FormGroup, Form, ToggleButton, Button} from "react-bootstrap";
import { useEffect, useState,  } from "react";
import React from "react";
import axios from "../api/axios";

export default function CreateChatPopup(props) {
const [isTemporary, setIsTemporary] = useState(false);
const [showError, setShowError] = useState(false);
const dummyData = [
  "BotIzer",
  "Markneu22",
  "Lajtaib",
  "Placeholder"
]

useEffect(()=>{
console.log(props)
},[])
useEffect(()=>{
document.getElementById('daysToLive').value = ""
},[isTemporary])
const addFriends = dummyData.map((friend) => (
  <Row key={friend} className="p-0 m-0">
    <Col className="text-center px-3 my-auto">
      {friend}
    </Col>
    <Col className="text-end p-0">
      <ToggleButton variant="outline-warning">+</ToggleButton>
    </Col>
    
    <div className="custom-border"></div>
  </Row>
));
const selectFriend = dummyData.map((friend) => (
  <option key={friend} className="p-0 m-0 secondary">
      {friend}

  </option>
));
const CreateGroupChat = async () => {
  if(document.getElementById('groupName').value.trim() === ''
  || true) {
    setShowError(true)
    return
  }
  try {
    await axios.post(
      '/chat',
      {
        name: document.getElementById('groupName'),
        is_ttl: isTemporary,
        days_to_die:3,
        is_private: false,
        usernames: ['random', 'sorry', 'sajtostaller']
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    )
  } catch (error) {
    //do error handling soon
  }
  
}

  return(
    <>
      <Col className="m-2">
          <Row className="mx-auto text-center">
          </Row>
          <Row className="mx-auto text-center">
              <FormGroup data-bs-theme="dark">
              <Form.Label className="secondary">Group Name</Form.Label>
              <Form.Control placeholder="Stun's Group" className="w-50 mx-auto" id="groupName"></Form.Control>
              </FormGroup>
              <FormGroup>
                <Form.Label className="secondary">Participants</Form.Label>
                <Col style={{maxHeight:"80px"}} className="overflow-auto w-50 mx-auto custom-border p-2 my-2">
                  {addFriends}
                </Col>
              </FormGroup>
              <FormGroup data-bs-theme="dark">
                <Form.Check className="d-flex justify-content-center mx-auto secondary" type="checkbox" label="temporary?" id="isTemporary"
                onChange={(event)=>setIsTemporary(event.target.checked)}></Form.Check>
                <Form.Label className="secondary">Expiration interval (days)</Form.Label>
                <Form.Control disabled={!isTemporary} id="daysToLive" placeholder="e.g: 3" className="w-50 mx-auto"></Form.Control>
              </FormGroup>
          </Row>
          <Row className="mx-auto text-center">
          <Col>
            <Button
                  variant="outline-warning"
                  size="lg"
                  // onClick={() => } TODO: Make function that creates the chat
                  className="mt-3"
                >
                  Create
                </Button>
          </Col>
              <Col>
                <Button
                  variant="outline-danger"
                  size="lg"
                  // onClick={() => } TODO Make function that closes window? maybe easier on the page itself idk
                  className="mt-3"
                >
                  Cancel
                </Button>
              </Col>
          </Row>

      </Col>
    </>
  )
}