export default function Customer() {
  const details = {
    name: "Daksh Garg",
    date: new Date(),
    phone: "+91-1234567890",
    amount: "INR 12,00,000.12",
    reason: "Loan for vehicle purchase",
  };

  const reviewParams = {
    purpose: "Loan Underwriting CT001",
    timePeriod: "Last 4 months",
    frequency: "Monthly",
    expiry: "6 months",
  };

  const reviewInsights: string[] = [
    "Balance & cash flow",
    "Risk indicators",
    "Expense categorisation",
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="min-w-fit w-2/3">
        <CustomerDetails {...details} />
        <ReviewParameters {...reviewParams} />
        <ReviewInsights insights={reviewInsights} />
        <div className="flex bg-secondary text-white rounded p-2 justify-center text-sm mt-8">
          Fetch Insights
        </div>
      </div>
    </div>
  );
}

const CustomerDetails = (details: {
  name: string;
  date: Date;
  phone: string;
  amount: string;
  reason: string;
}) => {
  return (
    <div className="mt-4">
      <div className="text-xs"> CUSTOMER DETAILS</div>
      <div className="bg-white p-4 rounded-lg">
        <div className="font-semibold">{details.name}</div>
        <div className="text-xs mt-2">{details.phone}</div>

        <DetailRow title={"AMOUNT"} value={details.amount} />
        <DetailRow title={"DATE"} value={details.date.toLocaleString()} />
        <DetailRow title={"REASON"} value={details.reason} />
      </div>
    </div>
  );
};

const DetailRow = (props: { title: string; value: string }) => {
  return (
    <div className="mt-2 flex justify-between">
      <div className="text-xs text-secondaryText font-normal">
        {props.title}
      </div>
      <div className="text-xs">{props.value}</div>
    </div>
  );
};

const ReviewParameters = (params: {
  purpose: string;
  timePeriod: string;
  frequency: string;
  expiry: string;
}) => {
  return (
    <div className="mt-8">
      <div className="text-xs">REVIEW PRAMETERS</div>
      <div className="bg-white p-4  rounded-lg">
        <ReviewElement
          title="Purpose"
          value={params.purpose}
          type="secondary"
        />
        <ReviewElement
          title="Time period"
          value={params.timePeriod}
          type="primary"
        />
        <ReviewElement
          title="Frequency"
          value={params.frequency}
          type="primary"
        />
        <ReviewElement title="Expiry" value={params.expiry} type="primary" />
      </div>
    </div>
  );
};

const ReviewElement = (props: {
  title: string;
  value: string;
  type: "primary" | "secondary";
}) => {
  const secondaryCss = "text-xs bg-secondaryText bg-opacity-20 p-1 rounded";
  const primaryCss = "text-xs bg-secondary text-white font-medium  p-1 rounded";
  return (
    <div className="mt-2 flex justify-between">
      <div className="text-xs text-secondaryText font-normal">
        {props.title}
      </div>
      <div className={props.type === "primary" ? primaryCss : secondaryCss}>
        {props.value}
      </div>
    </div>
  );
};

const ReviewInsights = (props: { insights: string[] }) => {
  return (
    <div className="mt-8">
      <div className="text-xs">REVIEW INSIGHTS</div>
      <div className="bg-secondary bg-opacity-20 p-3 rounded flex space-x-2">
        {props.insights.map((i) => {
          return (
            <div className="text-xs bg-secondary text-white p-1 rounded">
              {i}
            </div>
          );
        })}
      </div>
    </div>
  );
};
