import {Row, Col, FormGroup, Form, ToggleButton, Button} from "react-bootstrap";
import { useEffect, useState,  } from "react";
import React from "react";




export default function CreateChatPopup() {
const [selectedValue, setSelectedValue] = useState(1);

const dummyData = [
  "BotIzer",
  "Markneu22",
  "Lajtaib",
  "Placeholder"
]


useEffect(() => {
  console.log(selectedValue);
}, [selectedValue])


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


  return(
    <>
      <Col>
          <Row className="mx-auto text-center">
            <FormGroup data-bs-theme="dark">
              <Form.Label>Select type</Form.Label>
              <Form.Select id="selectType"  value={selectedValue} onChange={(e) => {setSelectedValue(e.target.value)}}>
                
                <option value="1">Group</option>
                <option value="2">Direct message</option>
              </Form.Select>
            </FormGroup>
          </Row>
          <Row className="mx-auto text-center">
            { selectedValue == 1 ?
            <React.Fragment>
              <FormGroup>
                <Form.Label>Participants</Form.Label>
                <Col style={{maxHeight:"80px"}} className="overflow-auto w-50 mx-auto">
                  {addFriends}
                </Col>
              </FormGroup>
            </React.Fragment>
            :
            <React.Fragment>
              <FormGroup data-bs-theme="dark">
                <Form.Label>Participant</Form.Label>
                <Form.Select style={{maxHeight:"80px"}} className="overflow-auto w-50 mx-auto primary">
                  {selectFriend /*TODO make it so you can only select one person if DM is selected*/}
                </Form.Select>
              </FormGroup>
            </React.Fragment>} 
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