import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation() {
  const yellowTextStyle={
    color: "yellow",
  }
  return (
    <Navbar expand='lg' className='bg-body-tertiary' bg='dark' data-bs-theme='dark'>
      <Container>
        <Navbar.Brand style={yellowTextStyle} href='#home'>React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link style={yellowTextStyle} href='#home'>Friends</Nav.Link>
            <Nav.Link style={yellowTextStyle} href='#link'>Search</Nav.Link>
            <Nav.Link style={yellowTextStyle} href='#link'>User</Nav.Link>
            <Nav.Link style={yellowTextStyle} href='#link'>Notifications</Nav.Link>
            <Nav.Link style={yellowTextStyle} href='#link'>Blitz</Nav.Link>
            <Nav.Link style={yellowTextStyle} href='#home'>Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;