import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
function Navigation() {
  const [inputValue,setInputValue] = useState('');
  const textStyle={
    color: "yellow",
    fontSize: "16px"
    
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
    <Navbar expand='md' className='bg-body-tertiary ' bg='dark' data-bs-theme='dark'>
      <Container fluid>
        <Navbar.Brand style={textStyle} href='/'>BlitzForFriends</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
            <Nav.Link style={textStyle} href='/friends'>Friends</Nav.Link>
            </Nav>
            <Nav style={{width: '100%'}} className='mx-auto justify-content-center'>
            <Form inline style={{width:'50vw'}}> 
              <Form.Control
                type="text"
                placeholder="Search"
                className="mt-3 mt-md-0"
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
                onKeyDown={HandleKeyDown}
                style={{fontSize: '16px'}}
              />
            </Form>
            </Nav>
            <Nav>
          <Nav.Link style={textStyle} href='/user/{id}'>User</Nav.Link>
          <Nav.Link style={textStyle} href='/notifs'>Notifications</Nav.Link>
          <Nav.Link style={textStyle} href='/blitz'>Blitz</Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;