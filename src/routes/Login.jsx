import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";

export default function Login(){

  return (
    <>
      
      <Navigation></Navigation>
      <Container >
        <Row className="justify-content-center" xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto">
          <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" className="justify-content-center border border-warning rounded mt-5" style={{backgroundColor: "#4a4b4f"}}>
            <div className="border border-warning rounded p-5 my-3" style={{overflow: 'auto'}}>
              <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <button type="submit" className="btn btn-warning">Login</button>
              </Form>
              <Link to="/register">Register</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}