import { Button, FormGroup, Row, Image } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Navigation from "../components/Navigation";
import axios from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EditUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const [previewData, setPreviewData] = useState({
    username: "",
    profile_image: "",
    description: "",
  });
  const [displayError, setDisplayError] = useState(false)

  useEffect(()=>{
    const GetPreviewData = async () => {
      const response = await axios.get(`/user/${location.pathname.split('/')[2]}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
       setPreviewData({
        username: response.data.user.username,
        profile_image: response.data.user.profile_image,
        description: response.data.user.description,
      });
      document.getElementById("username").value = response.data.user.username;
      document.getElementById("fileUpload").value = response.data.user.profile_image;
      document.getElementById("description").value = response.data.user.description;
    };
    GetPreviewData();
  },[location.pathname])
  // TODO: save data to backend
  const SaveChanges = async () => {
    const username = document.getElementById("username").value.trim();
    const profilePicture = document.getElementById("fileUpload").value.trim();
    const description = document.getElementById("description").value.trim();
    if (username !== "" && profilePicture !== "") {
      await axios.put(
        '/user',
        {
          username: username,
          profile_image: profilePicture,
          description: description
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      navigate(`/user/${username}`)
    } else {
      setDisplayError(true);
    }
  };
  const Cancel = async () => {
    if (confirm("Are you sure you want to cancel editing?")) {
      navigate(`/user/${location.pathname.split('/')[2]}`)
    }
  };
  const DeleteProfile = async() => {
    if (confirm("Are you sure you want to delete your account?")) {
      const password = prompt("Please enter your password to confirm deletion")
      if (password === null || !password.trim()) {
        return;
      }
      await axios.delete(
        "/user",
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
            password: password
          },
          withCredentials: true,
        }
      );
      localStorage.clear()
      dispatchEvent(new Event('storage'))
      navigate('/')
    }
  }
  const HandleSelect = (key) =>{
    if(key === 'preview'){
      setPreviewData({
        username: document.getElementById("username").value,
        profile_image: document.getElementById("fileUpload").value,
        description: document.getElementById("description").value
      })
    }
  }


  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="editUser"
        className="d-flex mb-5 mx-auto my-5 text-nowrap"
        style={{ width: "40vw", borderBottom: "none" }}
        justify
        onSelect={HandleSelect}
      >
        <Tab eventKey="editUser" title="Edit" className="border tab-size p-2">
          <FormGroup
            className="p-2 w-100 h-100 text-center"
            data-bs-theme="dark"
          >
            <Form.Label className="secondary">Username</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="username"
              className="mb-3 title text-center"
              id="username"
            />
          </FormGroup>
          <FormGroup
            className="p-2 w-100 h-100 text-center"
            data-bs-theme="dark"
          >
            <Form.Label className="secondary">E-mail</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="example@placeholder.com"
              className="mb-3 title text-center"
              id="username"
            />
          </FormGroup>

          <FormGroup
            className="p-2 w-100 h-100 text-center"
            data-bs-theme="dark"
          >
            <Form.Label className="secondary">Profile picture</Form.Label>
            <Form.Control
              className="text-center mb-3"
              data-bs-theme="dark"
              placeholder="paste pfp link here"
              id="fileUpload"
            ></Form.Control>
          </FormGroup>
          <FormGroup className="text-center" data-bs-theme="dark">
            <Form.Label className="secondary">Description</Form.Label>
            <Form.Control
              className="text-center"
              as="textarea"
              placeholder="enter description"
              id="description"
            ></Form.Control>
            {displayError ? <div><span className="invalid">Username or Profile picture field is empty!</span></div> : null}
          </FormGroup>
          <div
            className="d-flex justify-content-around my-3"
            style={{ borderTop: "1px solid white" }}
          >
            <Button
              variant="outline-warning"
              size="lg"
              onClick={() =>
                SaveChanges()
              }
              className="mt-3"
            >
              Save
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => Cancel()}
              className="mt-3"
            >
              Cancel
            </Button>
          </div>
        </Tab>
        <Tab eventKey="editPass" title="Change Password" className="border tab-size p-2">
          <FormGroup
            className="p-2 w-100 h-100 text-center"
            data-bs-theme="dark"
          >
            <Form.Label className="secondary">Enter current password</Form.Label>
            <Form.Control
              
              size="lg"
              type="password"
              placeholder="current password"
              className="mb-3 title text-center"
              id="currentPass"
            />
          </FormGroup>
          <FormGroup
            className="p-2 w-100 h-100 text-center"
            data-bs-theme="dark"
          >
            <Form.Label className="secondary">New Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              placeholder="enter new password"
              className="mb-3 title text-center"
              id="newPass"
            />
          </FormGroup>
          <FormGroup
            className="p-2 w-100 h-100 text-center"
            data-bs-theme="dark"
          >
            <Form.Label className="secondary">Confirm new Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              placeholder="re-enter new password"
              className="mb-3 title text-center"
              id="confirmPass"
            />
            {/* TODO checks for password validity and error messages*/}
          </FormGroup>
          <div
            className="d-flex justify-content-around my-3"
            style={{ borderTop: "1px solid white" }}
          >
            <Button
              variant="outline-warning"
              size="lg"
              onClick={() =>
                SaveChanges()
              }
              className="mt-3"
            >
              Save
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => Cancel()}
              className="mt-3"
            >
              Cancel
            </Button>
          </div>
        </Tab>
        <Tab
          eventKey="deleteUser"
          title="Delete Profile"
          className="tab-size p-2 text-center"
        >
          <Button
            variant="outline-danger"
            size="lg"
            onClick={() => DeleteProfile()}
            className="mt-3"
          >
            Delete Profile
          </Button>
        </Tab>
        <Tab eventKey="preview" title="Preview" className="tab-size">
          <Row className="justify-content-center">
            <Image
              className="profileSize img-fluid"
              src={previewData.profile_image}
              roundedCircle
              style={{ float: "center" }}
            ></Image>
          </Row>
          <Row className="text-center">
            <h4>{previewData.username}</h4>
          </Row>
          <Row className="justify-content-center text-center">
            <p className="text-justify secondary">{previewData.description}</p>
          </Row>
        </Tab>
      </Tabs>
    </>
  );
}

export default EditUser;
