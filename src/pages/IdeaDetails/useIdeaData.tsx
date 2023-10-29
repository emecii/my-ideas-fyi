import { useState, useEffect, useRef } from "react";
import { IdeaDetails as IIdeaDetails } from "src/interfaces/Idea";
import isEqual from "lodash/isEqual";

function useIdeaData(ideaId: string) {
  const [idea, setIdea] = useState<IIdeaDetails | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const previousIdea = useRef(idea);

  const fetchData = async () => {
    try {
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
      setIdea(ideaDetails);
      console.log("Refresh idea success");
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
        console.error(err.message);
      } else {
        setError(new Error("An unknown error occurred"));
        console.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    console.log("previousIdea", previousIdea.current);
    console.log("currentIdea", idea);
    if (!previousIdea! || isEqual(previousIdea.current, idea)) {
      fetchData();
    }

    previousIdea.current = idea;
  }, [idea]);

  return { idea, error };
}

export default useIdeaData;
