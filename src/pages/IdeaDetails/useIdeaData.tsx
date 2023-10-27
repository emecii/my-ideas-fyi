import { useState, useCallback, useEffect } from "react";
import { IdeaDetails as IIdeaDetails } from "src/interfaces/Idea";

function useIdeaData(ideaId: string) {
    const [idea, setIdea] = useState<IIdeaDetails | null>(null);
    const [error, setError] = useState<Error | null>(null);
  
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
        console.error(err);
        setError(err);
      }
    };

    useEffect(() => {
        fetchData();
    }, []);
  
    return { idea, error };
  }
  

export default useIdeaData;
