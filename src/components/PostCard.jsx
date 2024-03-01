import { useNavigate } from "react-router-dom";
import { Card, Button, Col, ToggleButton } from "react-bootstrap";
import { daysDifference } from "./ForumCard"; //<-- idk where to put this
import { useState } from "react";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const [isDisLiked, setIsDisLiked] = useState(false);
  return (
    <Card className="text-center p-0" data-bs-theme="dark" xs={12} md={6}>
      <Card.Header className="primary">{post.title}</Card.Header>
      <Card.Body className="secondary">
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.content}</Card.Text>
        <Button
          onClick={() => navigate(`/posts/${post.id}`)}
          className="custom-button text-outline"
          variant="outline-warning"
        >
          View post
        </Button>
      </Card.Body>
      <Card.Footer>
        <Col className="text-start">
          <ToggleButton
            id="1"
            className="image-checkbox"
            type="checkbox"
            variant="secondary"
            checked={isLiked}
            value="1"
            onChange={(e) => setIsLiked(e.currentTarget.checked)}
          >
            <img
              src="/src/assets/icons/fist_bump_64.png"
              alt="fist-bump"
              className={isLiked ? "filter-gold" : "filter-grey"}
            />
          </ToggleButton>
          <ToggleButton
            id="2"
            className="image-checkbox"
            type="checkbox"
            variant="secondary"
            checked={isDisLiked}
            value="1"
            onChange={(e) => setIsDisLiked(e.currentTarget.checked)}
          >
            <img
              src="/src/assets/icons/skull.png"
              alt="skull"
              className={isDisLiked ? "filter-red" : "filter-grey"}
            />
          </ToggleButton>
        </Col>
      </Card.Footer>
      <Card.Footer className="text-muted">
        Posted {daysDifference(post.postDate, new Date())} days ago
      </Card.Footer>
    </Card>
  );
}
