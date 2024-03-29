import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "../api/axios";
import NotifDropdown from "./NotifDropdown";
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, Row } from "react-bootstrap";

function Navigation() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(
      localStorage.getItem("token") && localStorage.getItem("userInfo")
    );
    addEventListener("storage", () => {
      setIsLoggedIn(
        localStorage.getItem("token") && localStorage.getItem("userInfo")
      );
      navigate('/')
    });
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
  const RedirectToLink = async () => {
    await axios.post(
      "/search",
      {
        keyword: inputValue,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  };
  const HandleLogout = async () => {
    setIsLoggedIn(false);
    localStorage.clear();
    dispatchEvent(new Event('storage'))
  };
  const dummyItems = [
    { id: 1, name: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
  ];
  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary sticky overflow-responsive"
      bg="dark"
      data-bs-theme="dark"
      sticky="top"
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
              className="mx-2 my-auto"
              onClick={() => navigate("/chats")}
            >
              Friends
            </Nav.Link>
              <NotifDropdown></NotifDropdown>
          </Nav>
          <Nav
            style={{ width: "100%" }}
            className="mx-auto justify-content-center"
          >
            <Form className="custom-mw mx-2">
              <Form.Control
                type="text"
                placeholder="Search"
                className="mt-2 mt-md-0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={HandleKeyDown}
                style={{ fontSize: "16px" }}
              />
            <Dropdown show>
            <Dropdown.Menu className="custom-mw">
      {dummyItems.map((item) => (
        <Dropdown.Item className="d-flex justify-content-center"  key={item.id}>{item.name}</Dropdown.Item>
      ))}
           </Dropdown.Menu>
            </Dropdown>
            </Form>
          </Nav>
          <Nav>
            <Nav.Link
              style={textStyle}
              className="mx-2 my-2"
              onClick={() => navigate("/forums")}
            >
              Forums
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
