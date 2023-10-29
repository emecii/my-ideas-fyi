import { Params, ActionFunctionArgs, useParams, defer, useLoaderData } from "react-router-dom";
import { Idea, IdeaDetails, Comment, CommentReply, LoaderData } from "src/interfaces/Idea";
import { updateCurrentUser, updateIdeaById } from "@api/IdeaAPI";
import IdeaDetailsPage from "../../pages/IdeaDetails";
import { useAuth } from "@clerk/clerk-react";
import RootRoute from "..";

interface LoaderFunctionArgs {
  params: Params;
}

async function getIdeaById(ideaId: string): Promise<IdeaDetails> {
  const res = await fetch(`/api/idea/${ideaId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch idea with id ${ideaId}`);
  }
  const ideaDetails = await res.json();
  return ideaDetails;
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.ideaId) {
    throw new Error("Idea id missing");
  }
  const idea = await getIdeaById(params.ideaId);
  return {idea: idea};
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.ideaId) {
    throw new Error("Idea id missing");
  }
  if (!params.userId) {
    throw new Error("User id missing");
  }

  const ideaId = params.ideaId;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "addComment") {
    const idea = await getIdeaById(params.ideaId);
    const commentText = formData.get("comment")?.toString() ?? "";
    const comment: Comment = {
      id: crypto.randomUUID(),
      content: commentText,
      user: {
        image: "",
        name: params.userId,
        username: params.userId,
      },
    };
    const res = await fetch(`/api/idea/${params.ideaId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        comments:
        Array.isArray(idea.comments) && idea.comments.length > 0
          ? idea.comments?.concat(comment)
          : [comment],
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to add comment to idea with id ${ideaId}`);
    }
    return res.json();
  } else if (intent === "replyComment") {
    const idea = await getIdeaById(params.ideaId);
    if (idea.comments === undefined) {
      throw new Error(`Idea with id ${idea.id} has no comments to reply to`);
    }
    const content = formData.get("comment")?.toString() ?? "";
    const commentId = formData.get("commentId")?.toString() ?? "";
    const reply: CommentReply = {
      id: crypto.randomUUID(),
      content,
      replyingTo: params.userId,
      user: {
        image: "",
        name: params.userId,
        username: params.userId,
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
    const res = await fetch("/api/updateVotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voteId: ideaId,
        userId: params.userId,
        upVoted: upVoted,
      }),
    });
    if (res.ok) {
      return updateIdeaById(params.ideaId, {
        upvotes: Number(formData.get("upvotes")),
      } as Idea);
    }
  }

  return null;
}

export default function IdeaDetailsRoute() {
  const params = useParams();
  const ideaId = params.ideaId || "";
  const loaderData = useLoaderData() as LoaderData;
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <RootRoute />;
  } else {
    return <IdeaDetailsPage ideaId={ideaId} idea={loaderData.idea}/>;
  }
}
