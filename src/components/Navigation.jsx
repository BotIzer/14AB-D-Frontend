import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

function Navigation() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(
      localStorage.getItem("token") && localStorage.getItem("userInfo")
    );
  }, []);
  const [inputValue, setInputValue] = useState("");
  const textStyle = {
    color: "gold",
    fontSize: "20px",
  };

  const HandleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      RedirectToLink();
    }
  };
  const RedirectToLink = () => {
    const link = `/search/${inputValue}`;
    window.location.href = link;
  };
  const HandleLogout = async () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary "
      bg="dark"
      data-bs-theme="dark"
    >
      <Container fluid>
        <Nav.Link style={textStyle} onClick={() => navigate("/")}>
          BlitzForFriends
        </Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              style={textStyle}
              className="mx-2 my-2"
              onClick={() => navigate("/friends")}
            >
              FriendsTest
            </Nav.Link>
            <Nav.Link
              style={textStyle}
              className="mx-2 my-2"
              onClick={() => navigate("/notifications")}
            >
              Notifications
            </Nav.Link>
          </Nav>
          <Nav
            style={{ width: "100%" }}
            className="mx-auto justify-content-center"
          >
            <Form className="custom-mw">
              <Form.Control
                type="text"
                placeholder="Search"
                className="mt-2 mt-md-0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={HandleKeyDown}
                style={{ fontSize: "16px" }}
              />
            </Form>
          </Nav>
          <Nav>
            <Nav.Link
              style={textStyle}
              className="mx-2 my-2"
              onClick={() => navigate("/blitz")}
            >
              Blitz
            </Nav.Link>
            {isLoggedIn ? (
              <React.Fragment>
                <Nav.Link
                  style={textStyle}
                  className="mx-2 my-2"
                  onClick={() =>
                    navigate(
                      `/user/${
                        JSON.parse(localStorage.getItem("userInfo")).username
                      }`
                    )
                  }
                >
                  {JSON.parse(localStorage.getItem("userInfo")).username}
                </Nav.Link>
              </React.Fragment>
            ) : null}
            {isLoggedIn ? (
              <React.Fragment>
                <Nav.Link
                  style={textStyle}
                  className="mx-2 my-2"
                  onClick={() =>
                    window.confirm("Are you sure you want to log out?")
                      ? HandleLogout()
                      : null
                  }
                >
                  Logout
                </Nav.Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Nav.Link
                  style={textStyle}
                  className="mx-2 my-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  style={textStyle}
                  className="mx-2 my-2"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Nav.Link>
              </React.Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
