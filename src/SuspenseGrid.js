import * as React from "react";
import { wrapPromise, randomNumberAndTimeout } from "./Api";

const RomaJS = ({ resource }) => {
  const triggerSuspense = resource.num.read();
  return <div className="roma-js" />;
};

const tailOptions = ["none", "hidden", "collapsed"];

export const SuspenseGrid = () => {
  let body = [];
  const [n] = React.useState(391);
  const [groupSize] = React.useState(3);
  const [outerRevealOrder, setOuterRevealOrder] = React.useState("");
  const [tail, setTail] = React.useState(tailOptions[0]);
  const fetchResources = () => {
    const resources = [];
    for (let i = 0; i < n; i++) {
      resources.push(wrapPromise(randomNumberAndTimeout()));
    }
    return resources;
  };
  const [resources, setResources] = React.useState(() => fetchResources());

  for (let i = 0; i < n / groupSize - groupSize; i++) {
    const group = [];
    for (let k = 0; k < groupSize; k++) {
      const idx = i * groupSize + k;
      group.push(
        <React.Suspense
          key={idx}
          fallback={<div className="sandloader">⌛</div>}
        >
          <RomaJS resource={{ num: resources[idx] }} />
        </React.Suspense>
      );
    }
    body.push(...group);
  }

  return (
    <div className="show">
      <h1>🚀 React SuspenseList Example</h1>
      <button
        className="suspense-btn"
        onClick={() => {
          setOuterRevealOrder("");
          setResources(fetchResources());
        }}
      >
        No Suspense List
      </button>
      <button
        className="suspense-btn"
        onClick={() => {
          setOuterRevealOrder("forwards");
          setResources(fetchResources());
        }}
      >
        Forwards
      </button>
      <button
        className="suspense-btn"
        onClick={() => {
          setOuterRevealOrder("backwards");
          setResources(fetchResources());
        }}
      >
        Backwards
      </button>
      <button
        className="suspense-btn"
        onClick={() => {
          setOuterRevealOrder("together");
          setResources(fetchResources());
        }}
      >
        Together
      </button>
      <select
        id="tail"
        className="suspense-btn"
        value={tail}
        onChange={({ currentTarget }) => setTail(currentTarget.value)}
      >
        {tailOptions.map((value) => (
          <option key={value}>tail: {value}</option>
        ))}
      </select>
      <div className={"suspense-grid"}>
        {!outerRevealOrder && body}
        {!!outerRevealOrder && (
          <React.SuspenseList
            tail={tail === "none" ? undefined : tail}
            revealOrder={outerRevealOrder}
          >
            {body}
          </React.SuspenseList>
        )}
      </div>
    </div>
  );
};
