import { Suspense, useEffect } from "react";
import { Await, Link, useNavigate } from "react-router-dom";
import { Idea, IdeaDetails, Vote } from "src/interfaces/Idea";
import { ReactComponent as ChevronLeftIcon } from "@assets/chevron-left-icon.svg";
import IdeaCard from "@components/IdeaCard";
import Button from "@components/Button";
import Card from "@components/Card";
import Comment from "@components/Comment";
import AddComment from "@components/AddComment";
import Skeleton from "@components/Skeleton";
import styles from "./ideaDetails.module.css";
import useIdeaData from "./useIdeaData";

function transformToIdea(ideaDetails: IdeaDetails): Idea {
  const { id, title, category, upvotes, status, description, commentCount } =
    ideaDetails;
  return { id, title, category, upvotes, status, description, commentCount };
}

function IdeaDetailsPage({ ideaId }: { ideaId: string }) {
  const navigate = useNavigate();

  return (
    <main className={styles.ideaDetails}>
      <header>
        <Link to=".." onClick={() => navigate(-1)}>
          <ChevronLeftIcon /> Go Back
        </Link>

        <Button type="primaryBlue" to="edit">
          Edit Idea
        </Button>
      </header>
      <Suspense
        fallback={
          <div className={styles.loadingList}>
            <Card>
              <Skeleton />
            </Card>
          </div>
        }
      >
        <IdeaDetails ideaId={ideaId} />
      </Suspense>
    </main>
  );
}

function IdeaDetails({ ideaId }: { ideaId: string; commentCount?: number }) {
  const userVotes: Vote[] = [];
  const { idea } = useIdeaData(ideaId);
  if (!idea) {
    return null;
  }

  return (
    <div className={styles.content}>
      <IdeaCard
        idea={transformToIdea(idea)}
        upVoted={isIdeaUpVoted(userVotes, ideaId)}
      />

      {idea?.comments && idea.comments.length > 0 ? (
        <Card className={styles.comments}>
          <h3>{idea.comments.length} Comments</h3>
          {idea.comments.map((comment) => {
            return (
              <Comment
                key={comment.id}
                ideaId={idea.id}
                comment={comment}
                className={styles.comment}
              />
            );
          })}
        </Card>
      ) : null}

      <Card className={`${styles.addComment}`}>
        <h3>Add Comment</h3>
        <AddComment ideaId={ideaId} />
      </Card>
    </div>
  );
}

// TODO: Move this unot a utils module maybe?
function isIdeaUpVoted(userVotes: Vote[], ideaId: string): boolean {
  return userVotes.some((vote) => vote.productRequestId === ideaId);
}

export default IdeaDetailsPage;
