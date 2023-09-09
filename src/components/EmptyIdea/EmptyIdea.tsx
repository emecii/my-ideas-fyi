import Card from "@components/Card";
import EmptyIdeaGraphic from "@assets/empty-idea-graphic.png";
import Button from "@components/Button";
import styles from "./emptyIdea.module.css";

function EmptyIdea() {
  return (
    <Card className={styles.cardContainer}>
      <img src={EmptyIdeaGraphic} alt="Empty idea list" />
      <h2>There is no idea yet.</h2>
      <p>
        Got a suggestion? Found a bug that needs to be squashed? We love hearing
        about new ideas to improve our app.
      </p>
      <Button type="primaryPurple" to="/idea/new">
        + Add idea
      </Button>
    </Card>
  );
}

export default EmptyIdea;
