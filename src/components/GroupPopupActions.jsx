import { Button } from "react-bootstrap";

function FriendPopupActions() {
  const actions = ["Leave Group"];
  const list = actions.map((action) => (
    <Button
      className="list-group-item secondary h-100 w-100 p-2 custom-button"
      key={action}
    >
      <div>{action}</div>
    </Button>
  ));

  return (
    <div data-bs-theme="dark" className="border list-group list-group-flush h-100">
      {list}
    </div>
  );
}

export default FriendPopupActions;
