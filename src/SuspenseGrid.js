import * as React from "react";
import { wrapPromise, randomNumberAndTimeout } from "./Api";

function RomaJS({ resource, children }) {
  const triggerSuspense = resource.num.read();
  return <div className="roma-js">{children}</div>;
}

const tailOptions = ["none", "hidden", "collapsed"];
const revealOrderOptions = [
  { revealOrder: "", label: "No Suspense List" },
  { revealOrder: "forwards" },
  { revealOrder: "backwards" },
  { revealOrder: "together" },
];

const fetchResources = (count) => {
  const resources = [];
  for (let i = 0; i < count; i++) {
    resources.push(wrapPromise(randomNumberAndTimeout()));
  }
  return resources;
};

const createBody = (count, resources) => {
  let body = [];

  console.log(resources, count);

  for (let i = 0; i < count; i++) {
    body.push(
      <React.Suspense key={i} fallback={<div className="sandloader">⌛</div>}>
        <RomaJS resource={{ num: resources[i] }} />
      </React.Suspense>
    );
  }

  return body;
};

export const SuspenseGrid = () => {
  const [count] = React.useState(391);
  const [revealOrder, setRevealOrder] = React.useState("");
  const [tail, setTail] = React.useState(tailOptions[0]);
  const [resources, setResources] = React.useState(() => fetchResources(count));

  const body = createBody(count, resources);

  const refreshResources = () => {
    setResources(fetchResources(count));
  };

  return (
    <div className="show">
      <h1>🚀 React SuspenseList Example</h1>
      {revealOrderOptions.map(({ label, revealOrder: revealOrderOption }) => (
        <button
         key={revealOrderOption}
          onClick={() => {
            setRevealOrder(revealOrderOption);
            refreshResources();
          }}
          className="suspense-btn"
          type="button"
        >
          {label ?? revealOrderOption} {revealOrderOption === revealOrder && '✔'}
        </button>
      ))}
      <button type="button" className="suspense-btn" onClick={refreshResources}>
        refresh
      </button>
      <select
        id="tail"
        className="suspense-btn"
        value={tail}
        onChange={({ currentTarget }) => setTail(currentTarget.value)}
      >
        {tailOptions.map((value) => (
          <option key={value} value={value}>
            tail: {value}
          </option>
        ))}
      </select>
      <div className={"suspense-grid"}>
        {!revealOrder && body}
        {!!revealOrder && (
          <React.SuspenseList
            tail={tail === "none" ? undefined : tail}
            revealOrder={revealOrder}
          >
            {body}
          </React.SuspenseList>
        )}
      </div>
    </div>
  );
};
