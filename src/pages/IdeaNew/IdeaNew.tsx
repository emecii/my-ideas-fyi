import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ChevronLeftIcon } from "@assets/chevron-left-icon.svg";
import { ReactComponent as PlusIcon } from "@assets/plus-icon.svg";
import Card from "@components/Card";
import styles from "./ideaNew.module.css";
import IdeaForm from "@components/IdeaForm";

function IdeaNewPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.ideaNew}>
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
          <h3>Create New Idea</h3>
          <IdeaForm />
        </Card>
      </main>
    </div>
  );
}

export default IdeaNewPage;
