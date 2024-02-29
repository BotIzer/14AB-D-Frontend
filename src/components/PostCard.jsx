import { useNavigate } from 'react-router-dom';
import { Card, Button, Col, ToggleButton } from 'react-bootstrap';
import { daysDifference } from './ForumCard'; //<-- idk where to put this
import { useState } from 'react';

export default function PostCard({post}) {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
  return (
    <Card className="text-center p-0" data-bs-theme="dark">
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
        <Col>
        <ToggleButton
        className='image-checkbox'
          id="toggle-check"
          type="checkbox"
          variant="secondary"
          checked={isLiked}
          value="1"
          onChange={(e) => setIsLiked(e.currentTarget.checked)}
        ><img id="notification" src="/src/assets/icons/fist_bump_64.png" alt="notifications"  className="my-auto test"/></ToggleButton>
        </Col>
      </Card.Footer>
      <Card.Footer className="text-muted">
        Posted {daysDifference(post.postDate, new Date())} days ago
      </Card.Footer>
    </Card>
  );
}