import { FormGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TextEditor from "../components/TextEditor";
import Navigation from "../components/Navigation";

function CreatePost() {
  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey="post"
        className="d-flex mb-5 mx-auto my-5"
        style={{ width: "40vw"}}
        justify
      >
        <Tab eventKey="post" title="Post" className="d-flex justify-content-center border w-50 mx-auto my-5">
          <FormGroup className="p-2 w-100 h-100">
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control size="lg" type="text" placeholder="Title" className="mb-3" />
            <Form.Label className="secondary">Body</Form.Label>
            <TextEditor className='h-100'></TextEditor>
          </FormGroup>
        </Tab>
        <Tab eventKey="file" title="Add File">
          <Form.Control size="lg" type="text" placeholder="Large text" />
        </Tab>
      </Tabs>
    </>
  );
}

export default CreatePost;
