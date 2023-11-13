import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
function Navigation() {
  const [inputValue,setInputValue] = useState('');
  const yellowTextStyle={
    color: "yellow",
  }
  const HandleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      RedirectToLink();
    }
  };
  const RedirectToLink = () => {
    const link = `/search/${inputValue}`;
    window.location.href = link;
  };
  return (
    <Navbar expand='md' className='bg-body-tertiary' bg='dark' data-bs-theme='dark'>
      <Container fluid>
        <Navbar.Brand style={yellowTextStyle} href='/'>BlitzForFriends</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
            <Nav>
            <Form inline className='col-2'>
              <Form.Control
                type="text"
                placeholder="Search"
                className="mt-5 mt-md-0"
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
                onKeyDown={HandleKeyDown}
              />
            </Form>
          <Nav.Link style={yellowTextStyle} href='/friends'>Friends</Nav.Link>
          <Nav.Link style={yellowTextStyle} href='/user/{id}'>User</Nav.Link>
          <Nav.Link style={yellowTextStyle} href='/notifs'>Notifications</Nav.Link>
          <Nav.Link style={yellowTextStyle} href='/blitz'>Blitz</Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;