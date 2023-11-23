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
    <Container>
      <Row>
        <Col>
          <FriendList/>
        </Col>
          Second Column
        <Col>
        </Col>
        <Col>
          Third Column
        </Col>
      </Row>
    </Container>
    
    </>
  )
}

export default App
