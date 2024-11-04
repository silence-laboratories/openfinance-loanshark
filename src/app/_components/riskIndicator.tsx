const RiskIndicatorCard = (props: {
  title: string;
  value: string;
  info: string;
  infoType: "green" | "yellow" | "red";
}) => {
  return (
    <div className="flex flex-col bg-violet-50 p-2 rounded w-64 mr-2 mb-2">
      <div className="text-sm">{props.title}</div>
      <div className="text-lg">{props.value}</div>
      <div className="bg-green-200 text-xs p-1 rounded mt-2">{props.info}</div>
    </div>
  );
};

const RiskIndicator = () => {
  const riskIndicators: {
    title: string;
    value: string;
    info: string;
    infoType: "green" | "yellow" | "red";
  }[] = [
    {
      title: "Financial obligation ratio",
      value: "12%",
      info: "Healthy",
      infoType: "green",
    },
    {
      title: "Total outward cheque bounce",
      value: "3",
      info: "Even a single cheque bounce is a sign of danger",
      infoType: "red",
    },
    {
      title: "Total cash withdrawals",
      value: "₹ 92,472",
      info: "Withdrawal to deposit ratio too low.",
      infoType: "yellow",
    },
    {
      title: "Total cash deposits",
      value: "₹ 1,22,472",
      info: "Withdrawal to deposit ratio too low.",
      infoType: "yellow",
    },
  ];
  return (
    <div className="w-full bg-violet-200 rounded flex flex-col p-4 ">
      <div>RISK INDICATORS</div>
      <div className="text-xs">
        Financial profiling based on transaction period selected.
      </div>
      <div className="flex mt-4 flex-wrap ">
        {riskIndicators.map((ri) => (
          <RiskIndicatorCard {...ri} />
        ))}
      </div>
    </div>
  );
};

export default RiskIndicator;
