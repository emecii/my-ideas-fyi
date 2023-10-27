import { useFetcher } from "react-router-dom";
import { ReactComponent as ChevronIcon } from "@assets/chevron-icon.svg";
import styles from "./voteButton.module.css";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { IdeaDetails } from "src/interfaces/Idea";

interface VoteButtonProps {
  className?: string;
  ideaId: string;
  upVoted?: boolean;
  count?: number;
}

function VoteButton({ className = "", ideaId }: VoteButtonProps) {
  const { userId } = useAuth();
  const [voteCount, setVoteCount] = useState(0);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchUserMetadataAndIdeaDetails = async () => {
      // Fetch user's private metadata to see if they've upvoted this idea
      const userResponse = await fetch(`/api/metadata/${userId}`, {
        method: "POST",
      });
      const userMetadata = await userResponse.json();
      const hasUpvoted =
        userMetadata.votes && userMetadata.votes.includes(ideaId);
      setChecked(hasUpvoted);

      // Fetch the idea details to get the current upvote count
      const ideaResponse = await fetch(`/api/idea/${ideaId}`);
      const ideaData: IdeaDetails = await ideaResponse.json();
      setVoteCount(ideaData.upvotes);
    };

    fetchUserMetadataAndIdeaDetails();
  }, [ideaId, userId]);

  const handleVoteChange = async () => {
    const newVoteCount = checked ? voteCount - 1 : voteCount + 1;

    try {
      // First, update the user's metadata to reflect their vote.
      const resMetadata = await fetch("/api/updateVotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voteId: ideaId,
          userId: userId,
          isUpvote: !checked,
        }),
      });

      const metadataResponse = await resMetadata.json();

      if (metadataResponse.success) {
        // Next, if the metadata update was successful, update the idea's vote count.
        const resIdea = await fetch(`/api/idea/${ideaId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            upvotes: newVoteCount,
          }),
        });

        const ideaResponse = await resIdea.json();
        if (ideaResponse.upvotes === newVoteCount) {
          setVoteCount(newVoteCount);
          setChecked(!checked);
        } else {
          console.error("Failed to update idea votes:", ideaResponse.error);
        }
      } else {
        console.error(
          "Failed to update user metadata:",
          metadataResponse.error
        );
      }
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

  return (
    <label className={`${styles.voteButton} ${className}`}>
      <ChevronIcon className={styles.upVoteIcon} />
      <input
        name="upvotes"
        type="checkbox"
        checked={checked}
        value={voteCount}
        onClick={(event) => event.stopPropagation()}
        onChange={handleVoteChange}
        aria-checked={checked}
      />
      <b>{voteCount}</b>
    </label>
  );
}

export default VoteButton;
