import { Suspense } from "react";
import {
  Await,
  Link,
  useAsyncValue,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import {
  CurrentUser,
  IdeaDetails as IIdeaDetails,
  Vote,
} from "src/interfaces/Idea";
import { ReactComponent as ChevronLeftIcon } from "@assets/chevron-left-icon.svg";
import IdeaCard from "@components/IdeaCard";
import Button from "@components/Button";
import Card from "@components/Card";
import Comment from "@components/Comment";
import AddComment from "@components/AddComment";
import Skeleton from "@components/Skeleton";
import styles from "./ideaDetails.module.css";

type IdeaDetailsDataTuple = [IIdeaDetails, CurrentUser];
type IdeaDetailsData = {
  data: IdeaDetailsDataTuple;
};

function IdeaDetailsPage() {
  const navigate = useNavigate();
  const { data } = useLoaderData() as IdeaDetailsData;

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
        <Await resolve={data} errorElement={<p>Error loading home data</p>}>
          <IdeaDetails />
        </Await>
      </Suspense>
    </main>
  );
}

function IdeaDetails() {
  const [idea, currentUser] = useAsyncValue() as IdeaDetailsDataTuple;
  const userVotes = currentUser.votes ?? [];

  return (
    <div className={styles.content}>
      <IdeaCard
        idea={idea}
        upVoted={isIdeaUpVoted(userVotes, idea.id)}
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
        <AddComment ideaId={idea.id} />
      </Card>
    </div>
  );
}

// TODO: Move this unot a utils module maybe?
function isIdeaUpVoted(userVotes: Vote[], ideaId: string): boolean {
  return userVotes.some((vote) => vote.productRequestId === ideaId);
}

export default IdeaDetailsPage;
