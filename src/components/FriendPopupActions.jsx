import { Button } from "react-bootstrap";

function FriendPopupActions() {
    const actions = [
        "Profile",
        "Message",
        "Remove Friend",
    ]

    const list = actions.map((action) => (
        <Button className="list-group-item secondary h-100 p-2 custom-button" key={action}>
            <div>{action}</div>
        </Button>
    ));

    return (
            <div data-bs-theme="dark" className="d-grid w-25">
                {list}
            </div>
    )
}

export default FriendPopupActions;