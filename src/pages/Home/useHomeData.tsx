import { useState, useEffect } from "react";
import { Idea } from "src/interfaces/Idea";

function useHomeData() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/ideas/`);
        if (!res.ok) {
          throw new Error("Failed to fetch all ideas");
        }
        const ideaDetails = await res.json();
        setIdeas(ideaDetails);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error(err);
        }
      }
    };

    fetchData();
  }, []);

  return { ideas, loading };
}

export default useHomeData;
