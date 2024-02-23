import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function ForumTemplate(/*Uncomment once data is used from backend*/ /*props*/) {
    const navigate = useNavigate();
    const dummyForum = {
        "title": "DummyTitle",
        "description": "DummyDescription",
        "categories": ["gaming", "sports", "music"],
        "banner": "/src/assets/banner_test.jpg",
        "topPost": {
          "title" : "Post Title",
          "content": "Post Content",
        },
        "lastUpdated": "2021-06-28T14:30:00.000Z",
    }
    const sinceUpdate = daysDifference(dummyForum.lastUpdated, new Date()); /*props.forum.lastUpdated*/
    return (
      <>
      <Card className="text-center" data-bs-theme="dark">
      <Card.Header className="primary">{dummyForum.title}</Card.Header> {/*props.forum.title*/}
      <Card.Body className="secondary" style={{backgroundImage: `url(${dummyForum.banner})`, backgroundSize: "cover"}}> {/*props.forum.banner*/}
        <Card.Title>{dummyForum.topPost.title}</Card.Title> {/*props.forum.topPost.title*/}
        <Card.Text>
          <i>{dummyForum.topPost.content}</i> {/*props.forum.topPost.content*/}
        </Card.Text>
        <Button  onClick={() => navigate("/forums/" + dummyForum.title)} className="custom-button" variant="outline-warning">Visit forum</Button> {/*props.forum.title*/}
      </Card.Body>
      <Card.Footer className="text-muted">Last updated: <i>{sinceUpdate}</i> days ago</Card.Footer> 
    </Card>
    </>
  );
}
function daysDifference(first, second) {
  const date1 = new Date(first).getTime();
  const date2 = new Date(second).getTime();
  return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}


export default ForumTemplate;
