
import { useState } from 'react'
import { Col, Row, Container, Button, FormGroup, FormSelect, Form, Image } from 'react-bootstrap'

function Blacklist() {

  const [isBanned, setisBanned] = useState(true)
  //TODO Make this an individual field per person
//TODO Replace dummy data
  const dummyMembers = [
    {_id: 1,
    name: 'Markneu22'},
    {_id: 2,
    name: 'Lajtaib'},
  ]

  const dummyBanned = [
    {_id: 3,
      name: 'BotIzer'},
    {_id: 4,
      name: 'Placeholder'},
  ]

  const blackList = dummyBanned.map((banned) => (
    <Row key={banned._id} className='p-0 m-0' style={isBanned? {backgroundColor: 'rgba(255,0,0,0.2)'} : {backgroundColor: 'rgba(0,255,0,0.2)'}}>
      <Col className='text-start px-3 my-auto secondary'>
        <b>{banned.name}</b>
      </Col>
      <Col className='text-end p-0'>
        <Button variant={isBanned? 'outline-danger' : 'outline-success'}><Image className={isBanned? 'filter-red' : 'filter-green'} src={isBanned ? '/src/assets/icons/block.png' : '/src/assets/icons/check.png'}></Image></Button>
      </Col>
      <div style={{border: '2px solid #44454c'}}></div>
    </Row>
  ))

  const memberList = dummyMembers.map((member) => (
    <option key={member._id} className='p-0 m-0 secondary'>
        {member.name}
    </option>))

  return(
    <>
    <Container fluid data-bs-theme='dark'>
      <Col>
        <Row className='justify-content-center mb-4'><h1 className='text-center'>Blacklist of TestForum</h1></Row>
        <Row className='justify-content-center'>
          <FormGroup className='m-4 text-center'>
            <Form.Label>Select Member</Form.Label>
            <FormSelect className='text-danger'>
              {memberList}
            </FormSelect>
            <Button className='m-2' variant='outline-danger'>Ban</Button>
          </FormGroup>
        </Row>
        <Row className='justify-content-center p-2'><div style={{maxHeight: '50vh'}} className='overflow-auto border border-danger p-2'>{blackList}</div></Row>
      </Col>
      <Row className='justify-content-center m-5'>
        <div style={{width: 'auto'}} className='text-center'>
        <Button className='m-2' variant='outline-warning'>Save changes</Button>
        <Button className='m-2' variant='outline-danger'>Cancel</Button>
        </div>
      </Row>
    </Container>
    </>
  )
}

export default Blacklist