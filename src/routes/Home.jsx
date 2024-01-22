import Navigation from '../components/Navigation'
import FriendList from '../components/FriendList'
<<<<<<< HEAD
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Cookies } from 'react-cookie';
import axios from '../api/axios'


export default function Home() {
  const LOGGED_USER_URL = '/user/'
  const USER_INFORMATION = '/userInfo'
  const cookies = new Cookies();
  if (!cookies.userInformation) {
    const userToken = cookies.get('token');
    axios.get(USER_INFORMATION, {
      headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${userToken}` },
      withCredentials: false,
    })
  }
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
=======
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Home() {
  return (
    <>
      <Navigation />
      <Container fluid>
        <Row>
          <Col className="border" xs={4} sm={3} md={2} lg={2} xl={2} xxl={2}>
            <FriendList />
          </Col>
          <Col className="d-flex justify-content-center border">
            Second Column
          </Col>
          <Col className="border" xs={4} sm={3} md={2} lg={2} xl={2} xxl={2}>
            Third Column
          </Col>
        </Row>
      </Container>
    </>
  )
}
>>>>>>> main
