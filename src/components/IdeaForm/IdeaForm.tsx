import { useState } from "react";
import { Form, useNavigate, useNavigation } from "react-router-dom";
import { Idea, IdeaStatus, IdeaTag } from "src/interfaces/Idea";
import Select from "react-dropdown-select";
import Button from "@components/Button";
import styles from "./ideaForm.module.css";

const categories = [
  { label: "All", value: "all" },
  { label: "Gen AI", value: "Gen AI" },
  { label: "Web3", value: "Web3" },
  { label: "Social Networks", value: "Social Networks" },
  { label: "FinTech", value: "FinTech" },
  { label: "Developer Tools", value: "Developer Tools" },
];

const statusList = [
  { label: "Suggestion", value: "suggestion" },
  { label: "Planned", value: "planned" },
  { label: "In-Progress", value: "in-progress" },
  { label: "Live", value: "live" },
];

interface IdeaFormProps {
  defaultIdea?: Idea;
  editing?: boolean;
}

interface IdeaFormProps {
  defaultIdea?: Idea;
  editing?: boolean;
  onDelete?: () => void;
}

function IdeaForm({ defaultIdea, editing = false, onDelete }: IdeaFormProps) {
  const navigate = useNavigate();
  const submittingForm = useNavigation().state === "submitting";
  const defaultCategory = defaultIdea?.category ?? "All";
  const defaultCategoryValue = categories.find(
    (c) => c.value === defaultCategory
  );
  const defaultStatus = defaultIdea?.status ?? "suggestion";
  const defaultStatusValue = statusList.find((c) => c.value === defaultStatus);
  const [category, setCategory] = useState<IdeaTag>(defaultCategory);
  const [status, setStatus] = useState<IdeaStatus>(defaultStatus);
  const [formSubmitted, setFormSubmitted] = useState(false);

  function handleSubmitForm() {
    setFormSubmitted(true);
  }

  async function handleDeleteClick() {
    if (onDelete) {
      onDelete();
    }
  }

  return (
    <Form
      className={`
  ${styles.form} 
  ${formSubmitted ? styles.formSubmitted : ""} 
  ${submittingForm ? styles.submitting : " "}
  `}
      method="post"
    >
      <div className={styles.formElement}>
        <label htmlFor="summary">Idea summary</label>
        <p>Add a short, descriptive line</p>
        <input
          type="text"
          name="title"
          disabled={submittingForm}
          defaultValue={defaultIdea?.title}
          required
        />
        <span className={styles.errorMsg}>Can&apos;t be empty</span>
      </div>
      <div className={styles.formElement}>
        <label htmlFor="title">Category</label>
        <p>Choose a category for your idea</p>
        <Select
          className={styles.select}
          dropdownGap={-60}
          searchable={false}
          options={categories}
          values={
            defaultCategoryValue ? [defaultCategoryValue] : [categories[0]]
          }
          disabled={submittingForm}
          onChange={(values) => {
            setCategory(values[0].value as IdeaTag);
          }}
          required
        />
        <input
          type="hidden"
          name="category"
          disabled={submittingForm}
          value={category}
        />
      </div>

      {editing ? (
        <div className={styles.formElement}>
          <label htmlFor="title">Update Status</label>
          <p>Change feature state</p>
          <Select
            className={styles.select}
            searchable={false}
            options={statusList}
            values={defaultStatusValue ? [defaultStatusValue] : [statusList[0]]}
            disabled={submittingForm}
            onChange={(values) => {
              setStatus(values[0].value as IdeaStatus);
            }}
            required
          />
          <input
            type="hidden"
            name="status"
            disabled={submittingForm}
            value={status}
          />
        </div>
      ) : null}

      <div className={styles.formElement}>
        <label htmlFor="title">Idea Details</label>
        <p>
          Include any specific comments on what should be improved, added, etc.
        </p>
        <textarea
          rows={4}
          name="description"
          defaultValue={defaultIdea?.description}
          required
        ></textarea>
        <span className={styles.errorMsg}>Can&apos;t be empty</span>
      </div>
      {editing ? (
        <Button
          type="primaryPurple"
          htmlType="submit"
          name="intent"
          value="update"
          disabled={submittingForm}
          onClick={handleSubmitForm}
          block
        >
          {submittingForm ? "Saving changes" : "Save Changes"}
        </Button>
      ) : (
        <Button
          type="primaryPurple"
          htmlType="submit"
          name="intent"
          value="add"
          disabled={submittingForm}
          onClick={handleSubmitForm}
          block
        >
          {submittingForm ? "Adding idea..." : "Add Idea"}
        </Button>
      )}
      <Button
        to=".."
        type="dark"
        onClick={() => navigate(-1)}
        disabled={submittingForm}
        block
      >
        Cancel
      </Button>
      {editing ? (
        <Button
          type="danger"
          onClick={handleDeleteClick}
          block
        >
          Delete
        </Button>
      ) : null}
    </Form>
  );
}

export default IdeaForm;
