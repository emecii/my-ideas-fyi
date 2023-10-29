import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  redirect,
  useParams,
  useLoaderData,
} from "react-router-dom";
import IdeaEditPage from "../../pages/IdeaEdit";
import { Idea, IdeaDetails, LoaderData } from "src/interfaces/Idea";

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
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const ideaId = params.ideaId;

  if (!ideaId) {
    return redirect("/");
  }

  if (updates.intent != "delete") {
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
}

function IdeaEditRoute() {
  const params = useParams();
  const loaderData = useLoaderData() as LoaderData;
  const ideaId = params.ideaId || "";
  return <IdeaEditPage ideaId={ideaId} idea={loaderData.idea}/>;
}

export default IdeaEditRoute;
