import { Button, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ForumCard(forum) {
  const navigate = useNavigate();

  const sinceUpdate = daysDifference(forum.forum.lastUpdated, new Date());
  // TODO: Fix this
  const categoryList = forum.forum.categories.map((category,index) => (
    <th style={{ fontSize: "small" }} key={index}>
      <i className="tertiary">{category}</i>
    </th>
  ));
  return (
    <>
      <Card className="text-center p-0" data-bs-theme="dark">
        <Card.Header className="primary">{forum.forum.title}</Card.Header>
        <Card.Body
          className="secondary"
          style={{
            backgroundImage: `url(${forum.forum.banner})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
            //TODO make the image scale down with screen size instead of cut off
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
        <Card.Header className="p-0">
          <Table responsive className="m-0">
            <tbody>
              <tr>{categoryList}</tr>
            </tbody>
          </Table>
        </Card.Header>
        <Card.Footer className="text-muted">
          Last updated: <i>{sinceUpdate}</i> days ago
        </Card.Footer>
      </Card>
    </>
  );
}
export function daysDifference(first, second) {
  const date1 = new Date(first).getTime();
  const date2 = new Date(second).getTime();
  return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}

export default ForumCard;
