import { ActionFunctionArgs, redirect } from "react-router-dom";
import IdeaNewPage from "../../pages/IdeaNew";
import { Idea } from "src/interfaces/Idea";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const idea = {
    id: crypto.randomUUID(),
    title: updates.title,
    category: updates.category,
    upvotes: 0,
    status: "suggestion",
    description: updates.description,
    commentCount: 0,
  } as Idea;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(idea)
  };
  const response = await (await fetch("/api/idea", requestOptions)).json();
  if (response.id === idea.id) {
    return redirect(`../idea/${idea.id}/${params.userId}`);
  } else {
    throw new Error("There was an issue adding the new idea");
  }
}

function IdeaNewRoute() {
  return <IdeaNewPage />;
}

export default IdeaNewRoute;
