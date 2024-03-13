import { Button, FormGroup, Row, Image } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Navigation from "../components/Navigation";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function EditUser() {
  const navigate = useNavigate();
  const preview = {
    username: "test",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex cupiditate neque at itaque accusamus veritatis eligendi autem aperiam. Dolores provident voluptas est perferendis doloremque qui nulla ab, quaerat excepturi saepe.",
    pfp: "/src/assets/react.svg",
  }; //Make this dynamic
  const SaveChanges = async () => {
    const username = document.getElementById("username").value.trim();
    const profilePicture = document.getElementById("fileUpload").value.trim();
    if (username !== "" && profilePicture !== "") {
      // TODO: Display error if title/banner is empty!
      await axios.post(
        "/forum",
        {
          forum_name: title,
          banner: banner,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
    } else {
      return;
    }
  };
  const ClearAll = async () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      document.getElementById("title").value = "";
      document.getElementById("fileUpload").value = "";
    }
  };
  const DeleteProfile = async() => {
    if (confirm("Are you sure you want to delete your account?")) {
      const password = prompt("Please enter your password to confirm deletion")
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
  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="editUser"
        className="d-flex mb-5 mx-auto my-5 text-nowrap"
        style={{ width: "40vw", borderBottom: "none" }}
        justify
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
            ></Form.Control>
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
              onClick={() => ClearAll()}
              /*TODO route back to profile page, rename function*/
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
              src="/src/assets/react.svg"
              roundedCircle
              style={{ float: "center" }}
            ></Image>
          </Row>
          <Row className="text-center">
            <h4>{preview.username}</h4>
          </Row>
          <Row className="justify-content-center text-center">
            <p className="text-justify secondary">{preview.description}</p>
          </Row>
        </Tab>
      </Tabs>
    </>
  );
}

export default EditUser;
