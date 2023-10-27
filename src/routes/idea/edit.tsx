import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  redirect,
  useParams,
} from "react-router-dom";
import IdeaEditPage from "../../pages/IdeaEdit";
import {
  deleteIdea,
  getIdeaById,
  updateIdeaById,
} from "@api/IdeaAPI";
import { Idea } from "src/interfaces/Idea";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.ideaId) {
    throw new Error("Idea id missing");
  }
  const ideaPromise = getIdeaById(params.ideaId);
  return defer({ ideaPromise });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const ideaId = params.ideaId;

  if (!ideaId) {
    return redirect("/");
  }
  

  if (updates.intent === "delete") {
    await deleteIdea(ideaId);
    return redirect("/");
  }
  // Update idea
  const idea = {
    id: params.ideaId,
    title: updates.title,
    category: updates.category,
    status: updates.status,
    description: updates.description,
  } as Idea;

  const res = fetch(`/api/idea/${ideaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(idea),
  });

  const response = await (await res).json();

  if (response.id === idea.id) {
    return redirect(`../idea/${idea.id}/${params.userId}}`);
  } else {
    throw new Error("There was an issue adding the new idea");
  }
}

function IdeaEditRoute() {
  const params = useParams();
  const ideaId = params.ideaId || "";
  return <IdeaEditPage ideaId={ideaId}/>;
}

export default IdeaEditRoute;
