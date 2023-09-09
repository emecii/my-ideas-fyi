import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootRoute, {
  loader as homeLoader,
  action as homeAction,
} from "./routes";
import IdeaDetailsRoute, {
  loader as ideaDetailsLoader,
  action as ideaDetailsAction,
} from "./routes/idea";
import IdeaNewRoute, {
  action as ideaNewAction,
} from "./routes/idea/new";
import IdeaEditRoute, {
  loader as ideaEditLoader,
  action as ideaEditAction,
} from "./routes/idea/edit";
import RoadmapRoute from "./routes/roadmap";
import dataJSON from "./data.json";

function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("data");
    if (data === null) {
      localStorage.setItem("data", JSON.stringify(dataJSON));
    }
    setDataLoaded(true);
  }, []);

  if (dataLoaded) {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <RootRoute />,
        loader: homeLoader,
        action: homeAction,
      },
      {
        path: "/idea/new",
        element: <IdeaNewRoute />,
        action: ideaNewAction,
      },
      {
        path: "/idea/:ideaId",
        element: <IdeaDetailsRoute />,
        loader: ideaDetailsLoader,
        action: ideaDetailsAction,
      },
      {
        path: "/idea/:ideaId/edit",
        element: <IdeaEditRoute />,
        loader: ideaEditLoader,
        action: ideaEditAction,
      },
      {
        path: "/roadmap",
        element: <RoadmapRoute />,
      },
    ]);

    return <RouterProvider router={router} />;
  }
  return <>Loading data...</>;
}

export default App;
