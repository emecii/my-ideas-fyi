import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootRoute, {
  loader as homeLoader,
  action as homeAction,
} from "./routes";
import IdeaDetailsRoute, {
  loader as ideaDetailsLoader,
  action as ideaDetailsAction,
} from "./routes/idea";
import IdeaNewRoute, { action as ideaNewAction } from "./routes/idea/new";
import IdeaEditRoute, {
  loader as ideaEditLoader,
  action as ideaEditAction,
} from "./routes/idea/edit";
import RoadmapRoute from "./routes/roadmap";
import { ClerkProvider, SignIn, SignUp } from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootRoute />,
      action: homeAction,
      loader: homeLoader,
    },
    {
      path: "/sign-in/*",
      element: <SignIn routing="path" path="/sign-in" />,
    },
    {
      path: "/sign-up/*",
      element: <SignUp routing="path" path="/sign-up" />,
    },
    {
      path: "/idea/new/:userId",
      element: <IdeaNewRoute />,
      action: ideaNewAction,
    },
    {
      path: "/idea/:ideaId/:userId",
      element: <IdeaDetailsRoute />,
      loader: ideaDetailsLoader,
      action: ideaDetailsAction,
    },
    {
      path: "/idea/:ideaId/:userId/edit",
      element: <IdeaEditRoute />,
      loader: ideaEditLoader,
      action: ideaEditAction,
    },
    {
      path: "/roadmap",
      element: <RoadmapRoute />,
    },
  ]);
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <div className="App container">
        <RouterProvider router={router} />
      </div>
    </ClerkProvider>
  );
}

export default App;
