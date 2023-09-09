import { useState } from "react";
import { CommentReply } from "src/interfaces/Idea";
import AvatarTestImage from "@assets/avatar-test.png";
import CommentHeader from "./CommentHeader";
import AddComment from "@components/AddComment";
import styles from "./comment.module.css";

interface CommentReplyProps {
  className?: string;
  reply: CommentReply;
  ideaId: string;
  commentId: string;
}

function CommentReply({
  className = "",
  reply,
  ideaId,
  commentId,
}: CommentReplyProps) {
  const { user, content, replyingTo } = reply;
  const [replyFormVisible, setReplyFormVisible] = useState(false);

  function toggleReply() {
    setReplyFormVisible(!replyFormVisible);
  }

  return (
    <div className={`${styles.comment} ${className || ""}`}>
      <img src={AvatarTestImage} alt={user.name} />
      <CommentHeader user={user} onClickReply={toggleReply} />
      <p className={styles.content}>
        <b>@{replyingTo}</b> {content}
      </p>
      <div
        className={styles.replyForm}
        style={{ display: replyFormVisible ? "block" : "none" }}
      >
        <AddComment
          ideaId={ideaId}
          commentId={commentId}
          onCommentSubmitted={() => setReplyFormVisible(false)}
        />
      </div>
    </div>
  );
}

export default CommentReply;
