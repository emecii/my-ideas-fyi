import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  Link,
} from "react-router-dom";
import { Idea, IdeaStatus } from "src/interfaces/Idea";
import { getIdeaList, updateIdeaById, updateCurrentUser } from "@api/IdeaAPI";
import HomePage from "../pages/Home";
import { useAuth } from "@clerk/clerk-react";
import SignInPage from "../pages/SignIn/SignInPage";

type HomeURLSearchParams = {
  q: string;
  sortBy: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const { q, sortBy } = Object.fromEntries(
    url.searchParams
  ) as HomeURLSearchParams;
  const status: IdeaStatus = "suggestion";

  const ideaListPromise = getIdeaList(q, sortBy, status);

  return defer({
    data: Promise.all([ideaListPromise]),
    q,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const ideaId = formData.get("ideaId")?.toString();
  if (!ideaId) {
    throw new Error("Idea id missing");
  }
  const userId = formData.get("userId")?.toString();
  if (!userId) {
    throw new Error("User id missing");
  }
  const upVoted = formData.get("upVoted") === "true";
  const res = await fetch("/api/updateVotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      voteId: ideaId,
      userId: userId,
      upVoted: upVoted,
    }),
  });
  if (res.ok) {
    return updateIdeaById(ideaId, {
      upvotes: Number(formData.get("upvotes")),
    } as Idea);
  }
}

export default function RootRoute() {
  const { isSignedIn } = useAuth();
  // console.log("Is signed in? ", isSignedIn);
  if (!isSignedIn) {
    return <SignInPage />;
  }
  return <HomePage />;
}
