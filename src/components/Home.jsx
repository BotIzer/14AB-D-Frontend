import Navigation from './Navigation'
import FriendList from './FriendList'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Home() {
  return ( 
  <>
    <Navigation/>
    <Container fluid>
     <Row>
        <Col className='border' xs={4} sm={3} md={2} lg={2} xl={2} xxl={2}>
          <FriendList/>
        </Col>
        <Col className='d-flex justify-content-center border'>
          Second Column
        </Col>
        <Col className='border' xs={4} sm={3} md={2} lg={2} xl={2} xxl={2}>
          Third Column
        </Col>
      </Row>
    </Container>
  </>
  );

}