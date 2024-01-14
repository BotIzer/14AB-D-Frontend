import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Navigation() {
  const navigate = useNavigate();
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
    <Navbar expand='lg' className='bg-body-tertiary ' bg='dark' data-bs-theme='dark'>
      <Container fluid>
        <Nav.Link style={textStyle} onClick={()=>navigate('/')}>BlitzForFriends</Nav.Link>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
            <Nav.Link style={textStyle} className='mx-2' onClick={()=>navigate('/friends')}>Friends</Nav.Link>
            <Nav.Link style={textStyle} className='mx-2' onClick={()=>navigate('/user/{id}')}>User</Nav.Link>
            </Nav>
            <Nav style={{width: '100%'}} className='mx-auto justify-content-center'>
            <Form style={{width:'35vw'}}> 
              <Form.Control
                type="text"
                placeholder="Search"
                className="mt-2 mt-md-0"
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
                onKeyDown={HandleKeyDown}
                style={{fontSize: '16px'}}
              />
            </Form>
            </Nav>
            <Nav>
          <Nav.Link style={textStyle} className='mx-2' onClick={()=>navigate('/notifications')}>Notifications</Nav.Link>
          <Nav.Link style={textStyle} className='mx-2' onClick={()=>navigate('/blitz')}>Blitz</Nav.Link>
          <Nav.Link style={textStyle} className='mx-2' onClick={()=>navigate('/login')}>Login</Nav.Link>
          <Nav.Link style={textStyle} className='mx-2' onClick={()=>navigate('/register')}>Register</Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;