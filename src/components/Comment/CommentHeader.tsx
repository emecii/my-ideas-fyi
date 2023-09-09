import { MouseEventHandler } from "react";
import { User } from "src/interfaces/Idea";
import Button from "@components/Button";
import styles from "./comment.module.css";

interface CommentHeaderProps {
  user: User;
  onClickReply: MouseEventHandler;
}

function CommentHeader({ user, onClickReply }: CommentHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <h5>{user.name}</h5>
        <p>@{user.username}</p>
      </div>
      <Button type="link" onClick={onClickReply}>
        Reply
      </Button>
    </header>
  );
}

export default CommentHeader;
