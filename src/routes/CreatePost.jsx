import { FormGroup, FormLabel } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function CreatePost() {
  return (
    <Tabs
      defaultActiveKey="post"
      className="d-flex justify-content-center mb-5 mx-auto my-5 border"
      style={{ width: "40vw" }}
      justify
    >
      <Tab eventKey="post" title="Post">
        <FormGroup className="w-25 mx-auto">
          <FormLabel></FormLabel>
          <Form.Control size="lg" type="text" placeholder="Large text" />
          <Form.Control as="textarea"></Form.Control>
        </FormGroup>
      </Tab>
      <Tab eventKey="file" title="Add File">
        <Form.Control size="lg" type="text" placeholder="Large text" />
      </Tab>
    </Tabs>
  );
}

export default CreatePost;
