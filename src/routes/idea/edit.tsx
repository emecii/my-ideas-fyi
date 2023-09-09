import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  redirect,
} from "react-router-dom";
import IdeaEditPage from "../../pages/IdeaEdit";
import {
  deleteIdea,
  getIdeaById,
  updateIdeaById,
} from "@api/IdeaAPI";
import { Idea } from "src/interfaces/Idea";

export async function loader({ params }: LoaderFunctionArgs) {
  const ideaPromise = getIdeaById(params.ideaId);
  return defer({ ideaPromise });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);

  if (updates.intent === "delete") {
    await deleteIdea(params.ideaId);
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

  const response = await updateIdeaById(params.ideaId, idea);
  if (response.id === idea.id) {
    return redirect(`../idea/${idea.id}`);
  } else {
    throw new Error("There was an issue adding the new idea");
  }
}

function IdeaEditRoute() {
  return <IdeaEditPage />;
}

export default IdeaEditRoute;
