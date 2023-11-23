import { useState } from 'react'
import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css' 
import Navigation from './components/Navigation'
import FriendList from './components/FriendList'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function App() {

  return (
    <>
    <Navigation/>
    <Container fluid>
      <Row>
        <Col xs={2} md={2} lg={2} xl={2} xxl={2}>
          <FriendList/>
        </Col>
        <Col className='d-flex justify-content-center border'>
          Second Column
        </Col>
        <Col xs={2} md={2} lg={2} xl={2} xxl={2}>
          Third Column
        </Col>
      </Row>
    </Container>
    
    </>
  )
}

export default App
