// AuthWrapper.tsx

import { useAuth } from "@clerk/clerk-react";

function AuthWrapper({ children }: any) {
  const { userId } = useAuth();

  // Pass the userId to the children (which can be a function or component)
  return children(userId);
}

export default AuthWrapper;
