import { useState } from "react";
import { useNavigation, useSearchParams, useSubmit } from "react-router-dom";
import Card from "@components/Card";
import CheckableTag from "@components/Tag/CheckableTag";
import styles from "./tagsCard.module.css";

function TagsCard({ className = "", defaultTag = "All" }) {
  // console.log(defaultTag);

  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const [checkedTag, setCheckedTag] = useState(defaultTag);
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  // TODO: Get this data from API, localstorage or somewhere else
  const tags = ["All", "Gen AI", "Web3", "Social Networks", "FinTech", "Developer Tools"];

  const handleCheckTag = (tag: string) => {
    const searchParamsObj = Object.fromEntries(searchParams);
    setCheckedTag(tag);
    submit({ ...searchParamsObj, q: tag });
  };

  return (
    <Card
      className={`${styles.tagsCard} ${searching ? styles.searching : ""} ${
        className ?? ""
      }`}
    >
      {/* TODO: This might be better to do as a list for a11y reasons. */}
      {tags.map((tag) => (
        <CheckableTag
          checked={tag === checkedTag}
          key={tag}
          disabled={searching}
          onClick={() => handleCheckTag(tag)}
        >
          {tag}
        </CheckableTag>
      ))}
    </Card>
  );
}

export default TagsCard;
