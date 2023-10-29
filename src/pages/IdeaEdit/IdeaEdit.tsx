import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ChevronLeftIcon } from "@assets/chevron-left-icon.svg";
import { ReactComponent as PlusIcon } from "@assets/plus-icon.svg";
import Card from "@components/Card";
import IdeaForm from "@components/IdeaForm";
import styles from "./ideaEdit.module.css";
import { Suspense, useState } from "react";
import Skeleton from "@components/Skeleton";
import { IdeaDetails } from "../../interfaces/Idea";

function IdeaEditPage({ ideaId, idea }: { ideaId: string; idea: IdeaDetails }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  console.log("modal state: ", showModal);
  const handleDelete = async () => {
    const res = await fetch(`/api/idea/${ideaId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setShowModal(true);
    } else {
      // Handle error (maybe show an error toast or message)
    }

    setShowModal(false);
    // after 0.5 second, navigate to home page
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div className={styles.container}>
      <header>
        <Link to=".." onClick={() => navigate(-1)}>
          <ChevronLeftIcon /> Go Back
        </Link>
      </header>
      <main>
        {showModal && (
          <div className={styles.modalContainer}>
            <div className={styles.modalContent}>
              <h4>Warning</h4>
              <p>Are you sure you want to delete the idea?</p>
              <button onClick={handleDelete}>Yes</button>
            </div>
          </div>
        )}
        <span className={styles.plusIcon}>
          <PlusIcon />
        </span>
        <Card>
          <Suspense
            fallback={
              <div className={styles.loadingList}>
                <Card>
                  <Skeleton />
                </Card>
              </div>
            }
          >
            {idea ? (
              <>
                <h3>Editing {idea.title}</h3>
                <IdeaForm
                  defaultIdea={idea}
                  editing={true}
                  onDelete={() => {
                    setShowModal(true);
                  }}
                />
              </>
            ) : (
              <p>Error loading home data</p>
            )}
          </Suspense>
        </Card>
      </main>
    </div>
  );
}

export default IdeaEditPage;
