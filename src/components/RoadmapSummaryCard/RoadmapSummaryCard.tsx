import { Link } from "react-router-dom";
import { Idea } from "src/interfaces/Idea";
import Badge from "@components/Badge";
import Card from "@components/Card";
import styles from "./roadmapSummaryCard.module.css";

interface RoadmapSummaryCardProps {
  ideaList: Idea[];
}

function RoadmapSummaryCard({ ideaList }: RoadmapSummaryCardProps) {
  const countByStatus = getCountbyStatus(ideaList);
  const statusList = [
    {
      text: "Planned",
      count: countByStatus.planned,
      color: getCSSVariableValue("--accent-orange"),
    },
    {
      text: "In-Progress",
      count: countByStatus["in-progress"],
      color: getCSSVariableValue("--primary-purple"),
    },
    {
      text: "Live",
      count: countByStatus.live,
      color: getCSSVariableValue("--accent-blue"),
    },
  ];

  return (
    <Card className={styles.roadMapCard}>
      <header>
        <h3>Roadmap</h3> <Link to="roadmap">View</Link>
      </header>
      <ul>
        {statusList.map((status) => (
          <li key={status.text}>
            <Badge
              color={status.color}
              text={
                <>
                  {status.text} <b>{status.count}</b>
                </>
              }
              className={styles.roadMapBadge}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}

// TODO: Probably move to utils
function getCSSVariableValue(varName: string) {
  const style = getComputedStyle(document.body);
  return style.getPropertyValue(varName);
}

function getCountbyStatus(ideaList: Idea[]) {
  const countByStatus = {
    suggestion: 0,
    planned: 0,
    "in-progress": 0,
    live: 0,
  };
  ideaList.forEach((idea) => {
    countByStatus[idea.status] += 1;
  });

  return countByStatus;
}

export default RoadmapSummaryCard;
