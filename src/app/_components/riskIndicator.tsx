const RiskIndicatorCard = (props: {
  title: string;
  value: string;
  info: string;
  infoType: "green" | "yellow" | "red";
}) => {
  const warningCss =
    props.infoType === "green"
      ? "bg-green-200 text-xs p-1 rounded mt-2"
      : props.infoType === "red"
      ? "bg-red-600 bg-opacity-30 text-xs p-1 rounded mt-2"
      : "bg-orange-200 text-xs p-1 rounded mt-2";
  return (
    <div className="flex flex-col bg-bg3 p-2 rounded w-64 mr-2 mb-2">
      <div className="text-sm text-secondaryText">{props.title}</div>
      <div className="text-lg ">{props.value}</div>
      <div className={warningCss}>{props.info}</div>
    </div>
  );
};

const RiskIndicator = (props: {
  riskIndicators: {
    title: string;
    value: string;
    info: string;
    infoType: "green" | "yellow" | "red";
  }[];
}) => {
  return (
    <div className="w-full mt-8 bg-bg4 rounded flex flex-col p-4 ">
      <div className="text-primary">RISK INDICATORS</div>
      <div className="text-xs">
        Financial profiling based on transaction period selected.
      </div>
      <div className="flex mt-4 flex-wrap ">
        {props.riskIndicators.map((ri) => (
          <RiskIndicatorCard {...ri} />
        ))}
      </div>
    </div>
  );
};

export default RiskIndicator;
