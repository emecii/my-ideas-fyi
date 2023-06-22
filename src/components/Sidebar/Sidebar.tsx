import { useAsyncValue, useLoaderData } from "react-router-dom";
import { Feedback } from "src/interfaces/Feedback";
import { ReactComponent as CloseIcon } from "@assets/close-icon.svg";
import { ReactComponent as HamIcon } from "@assets/ham-icon.svg";
import Drawer from "@components/Drawer";
import Button from "@components/Button";
import RoadmapSummaryCard from "@components/RoadmapSummaryCard";
import TagsCard from "@components/TagsCard";
import styles from "./sidebar.module.css";

interface SidebarProps {
  open: boolean;
  toggle: () => void;
}

function Sidebar({ open = false, toggle }: SidebarProps) {
  const [feedbackList] = useAsyncValue() as [Feedback[]];
  const { q } = useLoaderData() as { q: string };

  return (
    <Drawer
      isOpen={open}
      toggleButton={
        <Button
          type="clean"
          ariaExpanded={open}
          ariaControls="drawer"
          onClick={toggle}
        >
          {open ? <CloseIcon /> : <HamIcon />}
        </Button>
      }
      toggle={toggle}
    >
      <TagsCard className={styles.tagsCard} defaultTag={q || "All"} />
      <RoadmapSummaryCard feedbackList={feedbackList} />
    </Drawer>
  );
}

export default Sidebar;
