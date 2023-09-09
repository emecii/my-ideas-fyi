import { Suspense, useState } from "react";
import {
  Await,
  useAsyncValue,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { CurrentUser, Idea, Vote } from "src/interfaces/Idea";
import { ReactComponent as ChevronIcon } from "@assets/chevron-icon.svg";
import { ReactComponent as BulbIcon } from "@assets/bulb-icon.svg";
import Select from "react-dropdown-select";
import Button from "@components/Button";
import Sidebar from "@components/Sidebar";
import EmptyIdea from "@components/EmptyIdea";
import IdeaCard from "@components/IdeaCard";
import Skeleton from "@components/Skeleton";
import Card from "@components/Card";
import styles from "./home.module.css";
import TagsCard from "@components/TagsCard";
import RoadmapSummaryCard from "@components/RoadmapSummaryCard";

// Next tasks
// 0. Add "status" field when editing idea. Filter suggestions in home to show only "suggestions" (4 pomodoros) [DONE in ~1 pomodoro]
// 1. Implement filtering by tag (3 pomodoros) [Done in ~3 pomodoros]
// 2. Show correct number of idea by category in the sidebar (2 pomodoros) [DONE in 1 pomodoro]
// 3. Implement comment creation and replies too (4 pomodoros) [Done 6 pomodoros]
// 4. Implement sorting dropdown (2 pomodoros) [Done 2 pomodoros]
// 5. Implement sorting logic in the "API" (2 pomodoros) [Done 2 pomodoros]
// 6. Create RoadmapCard component (1 pomodoro)
// 7. Create Column component (1 pomodoro)
// 8. Create Tabs component (3 pomodoros)
// 9. Create Roadmap page component (header + main) (3 pomodoros)
// 10. Prepare to support DnD (1 pomodoro)
// 11. Styles for tablet version (4 pomodoros)
// 12. Create Non-existent components for smartphone (2 pomodoros)
// 13. Styles for desktop version (4 pomodoros)
// 14. Write tests (8 pomodoros)
// 15. Corner case: There are two suggestions with the same upvotes, the list is sorted by most upvotes and you upvote the bottom one. It should sort the list accordingly.

// Next "Go to poland" tasks
// @. Test accessibillity
// a. Define naming convention for event handler props and event handler functions.
// b. Read and define convention on how to use size units in the project (CSS).
// c. How to type rr6 loaders ? https://github.com/remix-run/react-router/discussions/9792
// d. Improve how data is fetch and shared in the app (Sockets, Context API or Redux)
// e. Maybe change everything to be called ProductRequest instead of Idea ?
// f. Document the order in which imports should be done
// g. Add "Page" suffix at the end of page components
// h. Improve how icons are imported
// i. Create custom hooks
// j. Make a schema for the forms (https://www.taniarascia.com/schema-based-form-system/)

type HomeDataTuple = [Idea[], CurrentUser];
type HomeData = {
  data: HomeDataTuple;
};

const sortByOptions = [
  { label: "Most Upvotes", value: "moreVotes" },
  { label: "Least Upvotes", value: "lessVotes" },
  { label: "Most Comments", value: "moreComments" },
  { label: "Least Comments", value: "lessComments" },
];

function HomePage() {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const { data } = useLoaderData() as HomeData;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loading = navigation.state === "loading";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Suspense
        fallback={
          <div>
            <header className={styles.header}>
              <nav className={styles.nav}>
                <div>
                  <h1>My ideas FYI </h1>
                </div>
              </nav>
              {/* <TagsCard defaultTag={searchParams.get("q")?.toString()} />
              <RoadmapSummaryCard ideaList={[]} /> */}
            </header>
            <main className={styles.main}>
              <header>
                <p>
                  Sort by :{" "}
                  <b>
                    {sortByOptions[0].label} <ChevronIcon />{" "}
                  </b>
                </p>
                <Button to="/idea/new" disabled={true}>
                  + Add idea
                </Button>
              </header>
              <section className={styles.mainContent}>
                <Card>
                  <Skeleton />
                </Card>
              </section>
            </main>
          </div>
        }
      >
        <Await resolve={data} errorElement={<p>Error loading home data</p>}>
          <div className={loading ? styles.loading : undefined}>
            <header className={styles.header}>
              <nav className={styles.nav}>
                <div>
                  <h1>My ideas FYI</h1>
                </div>
                {/* TODO: Fix keyboard navigation which enters the sidebar when is hidden */}
                <Sidebar open={sidebarOpen} toggle={toggleSidebar} />
              </nav>
              <div className={styles.headerCards}>
                <Card className={styles.title}>
                  <div>
                    <h1>My ideas FYI</h1>
                  </div>
                </Card>
                <TagsCard defaultTag={searchParams.get("q")?.toString()} />
                <RoadmapSummaryCard ideaList={[]} />
              </div>
            </header>
            <main className={styles.main}>
              <IdeaListHeader loading={loading} />
              <IdeaList />
            </main>
          </div>
        </Await>
      </Suspense>
    </>
  );
}

function IdeaListHeader({ loading }: { loading: boolean }) {
  const submit = useSubmit();
  const [ideaList] = useAsyncValue() as HomeDataTuple;
  const [searchParams] = useSearchParams();
  const defaultSortingOption =
    sortByOptions.find(
      (option) => option.value === searchParams.get("sortBy")
    ) ?? sortByOptions[0];

  return (
    <header>
      <div>
        <h3 className={styles.suggestionCount}>
          {" "}
          <BulbIcon /> {ideaList?.length ?? 0} ideas
        </h3>
        <Select
          className={styles.select}
          searchable={false}
          options={sortByOptions}
          values={[defaultSortingOption]}
          contentRenderer={({ state }) => (
            <div style={{ cursor: "pointer" }}>
              Sort by : <b>{state.values[0].label}</b>
            </div>
          )}
          dropdownHandleRenderer={({ state }) => (
            <span
              className={`${styles.selectHandle} ${
                state.dropdown ? styles.active : ""
              }`}
            >
              <ChevronIcon />
            </span>
          )}
          disabled={loading}
          onChange={(values) => {
            const searchParamsObj = Object.fromEntries(searchParams);
            submit({ ...searchParamsObj, sortBy: values[0].value });
          }}
          required
        />
      </div>
      <Button to="/idea/new">+ Add idea</Button>
    </header>
  );
}

function IdeaList() {
  const [ideaList, currentUser] = useAsyncValue() as HomeDataTuple;

  return (
    <section className={styles.mainContent}>
      {ideaList?.length === 0 ? (
        <EmptyIdea />
      ) : (
        ideaList.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            redirectTo={`idea/${idea.id}`}
            upVoted={isIdeaUpVoted(currentUser.votes ?? [], idea.id)}
          />
        ))
      )}
    </section>
  );
}

// TODO: Move this into a utils module maybe?
function isIdeaUpVoted(userVotes: Vote[], ideaId: string): boolean {
  return userVotes.some((vote) => vote.productRequestId === ideaId);
}

export default HomePage;
