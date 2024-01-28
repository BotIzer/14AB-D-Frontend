import { Button, FormGroup, FormLabel } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TextEditor from "../components/TextEditor";
import Navigation from "../components/Navigation";
import DragAndDrop from "../components/DragAndDrop";

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
        <Tab eventKey="post" title="Post" className="border w-50 mx-auto my-5 p-2">
           <FormGroup className="p-2 w-100 h-100" controlId="textPost">
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control size="lg" type="text" placeholder="Title" className="mb-3" />
            <Form.Label className="secondary">Body</Form.Label>
            <TextEditor className='h-100'></TextEditor>
            <div className="d-flex justify-content-around my-3">
              <Button variant="outline-warning" size="lg">Post</Button>
              <Button variant="outline-danger" size="lg">Clear</Button>
            </div>
          </FormGroup>
        </Tab>
        <Tab eventKey="test" title="Test" className="border w-50 mx-auto my-5 p-2">
          <FormGroup className="p-2 w-100 h-100" controlId="filePost">
            <Form.Label className="secondary">Title</Form.Label>
            <Form.Control size="lg" type="text" placeholder="Title" className="mb-3" />
            <div className="d-flex justify-content-center m-2 secondary">
              <DragAndDrop></DragAndDrop>
            </div>
            <div className="d-flex justify-content-around my-3">
              <Button variant="outline-warning" size="lg">Post</Button>
              <Button variant="outline-danger" size="lg">Clear</Button>
            </div>
          </FormGroup>
        </Tab>
        
      </Tabs>
    </>
  );
}

export default CreatePost;
