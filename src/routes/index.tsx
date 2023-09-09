import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
} from "react-router-dom";
import { Idea, IdeaStatus } from "src/interfaces/Idea";
import {
  getIdeaList,
  getCurrentUser,
  updateIdeaById,
  updateCurrentUser,
} from "@api/IdeaAPI";
import HomePage from "../pages/Home";

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
  const currentUserPromise = getCurrentUser();

  return defer({
    data: Promise.all([ideaListPromise, currentUserPromise]),
    q,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const ideaId = formData.get("ideaId")?.toString();
  if (!ideaId) {
    throw new Error("Idea id missing");
  }
  const upVoted = formData.get("upVoted") === "true";
  const currentUser = await getCurrentUser();
  const updatedCurrentUser = {
    ...currentUser,
    votes: upVoted
      ? currentUser.votes?.concat({ productRequestId: ideaId, voted: "up" })
      : currentUser.votes?.filter(
          (vote) => vote.productRequestId !== ideaId
        ),
  };
  await updateCurrentUser(updatedCurrentUser);

  return updateIdeaById(ideaId, {
    upvotes: Number(formData.get("upvotes")),
  } as Idea);
}

export default function RootRoute() {
  return <HomePage />;
}
