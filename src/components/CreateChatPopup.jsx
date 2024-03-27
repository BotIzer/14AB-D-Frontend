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
      <Col className="m-2">
          <Row className="mx-auto text-center">
            <FormGroup data-bs-theme="dark">
              <Form.Label className="secondary">Select type</Form.Label>
              <Form.Select id="selectType" className="primary"  value={selectedValue} onChange={(e) => {setSelectedValue(e.target.value)}}>
                
                <option className="secondary" value="1">Group</option>
                <option className="secondary" value="2">Direct message</option>
              </Form.Select>
            </FormGroup>
          </Row>
          <Row className="mx-auto text-center">
            { selectedValue == 1 ?
            <React.Fragment>
              <FormGroup>
                <Form.Label className="secondary">Participants</Form.Label>
                <Col style={{maxHeight:"80px"}} className="overflow-auto w-50 mx-auto custom-border p-2 my-2">
                  {addFriends}
                </Col>
              </FormGroup>
              <FormGroup data-bs-theme="dark">
                <Form.Check className="d-flex justify-content-center mx-auto secondary" type="checkbox" label="temporary?"></Form.Check>
                <Form.Label className="secondary">Expiration interval (days)</Form.Label>
                <Form.Control placeholder="e.g: 3" className="w-50 mx-auto"></Form.Control>
              </FormGroup>
            </React.Fragment>
            :
            <React.Fragment>
              <FormGroup data-bs-theme="dark">
                <Form.Label className="secondary">Participant</Form.Label>
                <Form.Select style={{maxHeight:"80px"}} className="overflow-auto w-50 mx-auto primary">
                  {selectFriend /*TODO make it so you can only select one person if DM is selected*/}
                </Form.Select>
              </FormGroup>
              <FormGroup data-bs-theme="dark">
                <Form.Check className="d-flex justify-content-center mx-auto secondary my-2" type="checkbox" label="temporary?"></Form.Check>
                <Form.Label className="secondary">Expiration interval (days)</Form.Label>
                <Form.Control placeholder="e.g: 3" className="w-50 mx-auto"></Form.Control>
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