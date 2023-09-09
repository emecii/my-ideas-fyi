import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { ReactComponent as ChevronLeftIcon } from "@assets/chevron-left-icon.svg";
import { ReactComponent as PlusIcon } from "@assets/plus-icon.svg";
import { Idea } from "src/interfaces/Idea";
import Card from "@components/Card";
import IdeaForm from "@components/IdeaForm";
import styles from "./ideaEdit.module.css";
import { Suspense } from "react";
import Skeleton from "@components/Skeleton";

function IdeaEditPage() {
  const navigate = useNavigate();
  const { ideaPromise } = useLoaderData() as {
    ideaPromise: Promise<Idea>;
  };

  return (
    <div className={styles.container}>
      <header>
        <Link to=".." onClick={() => navigate(-1)}>
          <ChevronLeftIcon /> Go Back
        </Link>
      </header>
      <main>
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
            <Await
              resolve={ideaPromise}
              errorElement={<p>Error loading home data</p>}
            >
              {(idea) => (
                <>
                  <h3>Editing {idea.title}</h3>
                  <IdeaForm defaultIdea={idea} editing={true} />
                </>
              )}
            </Await>
          </Suspense>
        </Card>
      </main>
    </div>
  );
}

export default IdeaEditPage;
