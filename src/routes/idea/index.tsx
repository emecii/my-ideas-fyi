import { Params, ActionFunctionArgs, defer } from "react-router-dom";
import {
  Idea,
  IdeaDetails,
  Comment,
  CommentReply,
} from "src/interfaces/Idea";
import {
  getCurrentUser,
  getIdeaById,
  updateCurrentUser,
  updateIdeaById,
} from "@api/IdeaAPI";
import IdeaDetailsPage from "../../pages/IdeaDetails";

interface LoaderFunctionArgs {
  params: Params;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const idea = getIdeaById(params.ideaId);
  const currentUser = getCurrentUser();

  return defer({ data: Promise.all([idea, currentUser]) });
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.ideaId) {
    throw new Error("Idea id missing");
  }
  const ideaId = params.ideaId;
  const formData = await request.formData();
  const intent = formData.get("intent");
  const currentUser = await getCurrentUser();

  if (intent === "addComment") {
    const idea = await getIdeaById(params.ideaId);
    const commentText = formData.get("comment")?.toString() ?? "";
    const comment: Comment = {
      id: crypto.randomUUID(),
      content: commentText,
      user: {
        image: currentUser.image,
        name: currentUser.name,
        username: currentUser.username,
      },
    };
    return updateIdeaById(params.ideaId, {
      comments:
        Array.isArray(idea.comments) && idea.comments.length > 0
          ? idea.comments?.concat(comment)
          : [comment],
    } as IdeaDetails);
  } else if (intent === "replyComment") {
    const idea = await getIdeaById(params.ideaId);
    if (idea.comments === undefined) {
      throw new Error(
        `Idea with id ${idea.id} has no comments to reply to`
      );
    }
    const content = formData.get("comment")?.toString() ?? "";
    const commentId = formData.get("commentId")?.toString() ?? "";
    const reply: CommentReply = {
      id: crypto.randomUUID(),
      content,
      replyingTo: currentUser.username,
      user: {
        image: currentUser.image,
        name: currentUser.name,
        username: currentUser.username,
      },
    };
    const commentUpdated = idea.comments?.find(
      (comment) => comment.id === commentId
    );
    if (commentUpdated === undefined) {
      throw new Error(`Could not find comment to reply to (id: ${commentId})`);
    }

    if (Array.isArray(commentUpdated.replies)) {
      commentUpdated.replies.push(reply);
    } else {
      commentUpdated.replies = [reply];
    }

    return updateIdeaById(params.ideaId, {
      comments: idea.comments.map((comment) => {
        if (comment.id === commentId) {
          return commentUpdated;
        }
        return comment;
      }),
    } as IdeaDetails);
  } else if (intent === "upVote") {
    const upVoted = formData.get("upVoted") === "true";
    const updatedCurrentUser = {
      ...currentUser,
      votes: upVoted
        ? currentUser.votes?.concat({
            productRequestId: ideaId,
            voted: "up",
          })
        : currentUser.votes?.filter(
            (vote) => vote.productRequestId !== ideaId
          ),
    };

    await updateCurrentUser(updatedCurrentUser);
    return updateIdeaById(params.ideaId, {
      upvotes: Number(formData.get("upvotes")),
    } as Idea);
  }

  return null;
}

export default function IdeaDetailsRoute() {
  return <IdeaDetailsPage />;
}
