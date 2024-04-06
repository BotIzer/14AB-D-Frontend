
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "../api/axios";
import NotifDropdown from "./NotifDropdown";
import { Dropdown, Image, Container, Nav, Navbar, Form } from "react-bootstrap";
import {NotificationContext} from "../main"
function Navigation() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [pageDetails, setPageDetails] = useState({
    currentPage: parseInt(location.search.split('page=')[1]) || 0,
    limit: parseInt(location.search.split('limit=')[1]) || 10
  });
  const [searchResults, setSearchResults] = useState({forums: [], users: []});
  const [timerOff, setTimerOff] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const {forumData, setForumData} = useContext(NotificationContext)
  const [notifications, setNotifications] = useState([])
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
    const GetNotifications = async ()=>{
      const response = await axios.get('/notification',
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      setNotifications(response.data)
    }
    GetNotifications()
  }, []);
  const dropdownRef = useRef(null);
  const textStyle = {
    color: "gold",
    fontSize: "20px",
  };

  const HandleKeyDown = (event) => {
    event.preventDefault()
    if(inputValue.trim() === ""){
      return;
    }
    RedirectToLink();
  };
  const RedirectToLink = async () => {
    const response = await axios.post(
      "/search",
      {
        keyword: inputValue,
      },
      {
        params: {
          page: pageDetails.currentPage,
          limit: pageDetails.limit
        },
        headers: { "Content-Type": "application/json" },
      }
    );
    for (let index = 0; index < response.data.length; index++) {
      if (response.data[index][0] !== undefined) {
        if(response.data[index][0].forum_name !== undefined){
          navigate(`/forums/${response.data[index][0].forum_name}/${response.data[index][0]._id.forum_id}`)
          break;
        }
        else if(response.data[index][0].username !== undefined){
          navigate(`/user/${response.data[index][0].username}`)
          break;
        }
      }
    }
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
  useEffect(()=>{
    const updateDropdownWidth = () => {
      if (dropdownRef.current) {
        const width = dropdownRef.current.offsetWidth;
        setDropdownWidth(width);
      }
    };
    updateDropdownWidth()
  window.addEventListener("resize", updateDropdownWidth);
  return () => {
    window.removeEventListener("resize", updateDropdownWidth);
  };
  },[dropdownRef.current, dropdownWidth])
  useEffect(() => {
    setTimerOff(false)
    const timer = setTimeout(async () => {
      if (inputValue.trim() !== "") {
        const response = await axios.post(
          "/search",
          {
            keyword: inputValue,
          },
          {
            params: {
              page: pageDetails.currentPage,
              limit: pageDetails.limit
            },
            headers: { "Content-Type": "application/json" },
          }
        );
        let temporaryForumArray = [];
        let temporaryUserArray = [];
        response.data[0].forEach(element => {
          temporaryForumArray.push({
            id: element._id.forum_id,
            name: element.forum_name
          });
        })
        response.data[1].forEach(element => {
          temporaryUserArray.push({
            name: element.username
          });
        })
        setSearchResults({forums: temporaryForumArray, users: temporaryUserArray})
        setTimerOff(true)
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);
  useEffect(()=>{
    console.log(searchResults.users)
  },[searchResults])
  const HandleSearchNavigation = (route)=>{
    navigate(route)
  }
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
          BlitzForFriends <Image src="/src/assets/icons/BFF_Outline_128.png" style={{width: "64px", height: "64px"}}></Image>
        </Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? <Nav.Link
              style={textStyle}
              className="mx-2 my-auto"
              onClick={() => navigate("/chats")}
            >
              Chats
            </Nav.Link> : null}
              {isLoggedIn ? <NotifDropdown setForumData={()=>setForumData({...forumData, hasSent: true})} notificationData={forumData}></NotifDropdown> : null}
          </Nav>
          <Nav
            style={{ width: "100%" }}
            className="mx-auto justify-content-center"
          >
            <Form className="custom-mw mx-2" onSubmit={HandleKeyDown}>
              <Form.Control
                type="text"
                placeholder="Search"
                className="mt-2 mt-md-0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ fontSize: "16px" }}
                onFocus={()=>setShowSearchResults(true)} 
                onBlur={()=>setShowSearchResults(false)}
              />
            <Dropdown show={inputValue.trim() !== "" && showSearchResults}>
            <Dropdown.Menu className="custom-mw" ref={dropdownRef}>
      {searchResults.users.length > 0 && searchResults.users.map((item) => (
        <Dropdown.Item onPointerDown={()=>HandleSearchNavigation(`/user/${item.name}`)} className="d-flex justify-content-center"  key={item.name}>{item.name.length > 25 ? `${item.name.substring(0,Math.floor(dropdownWidth/16))}... (user)` : `${item.name} (user)`}</Dropdown.Item>
      ))}
      {searchResults.forums.length > 0 && searchResults.forums.map((item) => (
        <Dropdown.Item onPointerDown={()=>HandleSearchNavigation(`/forums/${item.name}/${item.id}`)} className="d-flex justify-content-center"  key={item.name}>{item.name.length > 25 ? `${item.name.substring(0,Math.floor(dropdownWidth/16))}... (forum)` : `${item.name} (forum)`}</Dropdown.Item>
      ))}
      {/* TODO: WHAT IS THIS */}
          {searchResults.users.length == 0 && searchResults.forums.length == 0 && timerOff && <Dropdown.Item onClick={()=>console.log("Hello?")} className="d-flex justify-content-center"  key="noResults">No search results</Dropdown.Item>}
           </Dropdown.Menu>
            </Dropdown>
            </Form>
          </Nav>
          <Nav>
            <Nav.Link
              style={textStyle}
              className="mx-2 my-2"
              onClick={() => navigate("/forums?page=0")}
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
