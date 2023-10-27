import { ReactComponent as CloseIcon } from "@assets/close-icon.svg";
import { ReactComponent as HamIcon } from "@assets/ham-icon.svg";
import Drawer from "@components/Drawer";
import Button from "@components/Button";
import RoadmapSummaryCard from "@components/RoadmapSummaryCard";
import TagsCard from "@components/TagsCard";
import styles from "./sidebar.module.css";
import { Idea } from "src/interfaces/Idea";

interface SidebarProps {
  open: boolean;
  toggle: () => void;
}

function Sidebar({ open = false, toggle }: SidebarProps) {
  const ideas: Idea[] = [];

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
      <TagsCard className={styles.tagsCard} defaultTag={"All"} />
      <RoadmapSummaryCard ideaList={ideas} />
    </Drawer>
  );
}

export default Sidebar;
