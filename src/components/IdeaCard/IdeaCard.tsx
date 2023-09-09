import { Idea } from "src/interfaces/Idea";
import Card from "@components/Card";
import Tag from "@components/Tag";
import VoteButton from "@components/VoteButton";
import CommentCount from "./CommentCount";
import styles from "./ideaCard.module.css";

interface IdeaCardProps {
  idea: Idea;
  redirectTo?: string;
  upVoted?: boolean;
}

function IdeaCard({
  idea,
  redirectTo,
  upVoted = false,
}: IdeaCardProps) {
  const {
    id,
    title = "",
    description = "",
    category = "All",
    upvotes = 0,
    commentCount = 0,
  } = idea;

  return (
    <Card
      to={redirectTo}
      className={`${styles.ideaCard} ${styles.linkWrapper}`}
    >
      <div>
        <aside>
          <VoteButton ideaId={id} upVoted={upVoted} count={upvotes} />
        </aside>
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
          <Tag className={styles.ideaCardTag}>{category}</Tag>
          <footer>
            <VoteButton ideaId={id} upVoted={upVoted} count={upvotes} />
            <CommentCount count={commentCount} />
          </footer>
        </div>
      </div>
      <aside>
        <CommentCount count={commentCount} />
      </aside>
    </Card>
  );
}

export default IdeaCard;
