import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ForumTemplate(forum) {
  const navigate = useNavigate();

  const sinceUpdate = daysDifference(forum.forum.lastUpdated, new Date());
  return (
    <>
      <Card className="text-center" data-bs-theme="dark">
        <Card.Header className="primary">{forum.forum.title}</Card.Header>
        <Card.Body
          className="secondary"
          style={{
            backgroundImage: `url(${forum.forum.banner})`,
            backgroundSize: "cover",
          }}
        >
          <Card.Title className="text-outline">
            {forum.forum.topPost.title}
          </Card.Title>
          <Card.Text className="text-outline">
            <i>{forum.forum.topPost.content}</i>
          </Card.Text>
          <Button
            onClick={() => navigate("/forums/" + forum.forum.title)}
            className="custom-button text-outline"
            variant="outline-warning"
          >
            Visit forum
          </Button>
        </Card.Body>
        <Card.Footer className="text-muted">
          Last updated: <i>{sinceUpdate}</i> days ago
        </Card.Footer>
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
