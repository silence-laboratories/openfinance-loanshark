import RiskIndicator from "../_components/riskIndicator";

export default function Dashboard() {
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

  const userBanks = [
    {
      accNo: "HDFC0123456789",
      type: "Savings account",
      isSelected: true,
    },
    {
      accNo: "HDFC0123456789",
      type: "Savings account",
      isSelected: false,
    },
  ];

  const currentBalance = 1224724;
  const totalCredits = 1224624;
  const totalDebits = 1224724;

  const balances = {
    currentBalance: 1224724,
    totalCredits: 1224624,
    totalDebits: 1224724,
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex flex-col min-w-80 w-4/5 h-screen">
        <div className="text-xs mt-8"> CUSTOMER PROFILE</div>
        <div className="flex mt-4 space-x-4 ">
          <CustomerProfile name={details.name} banks={userBanks} />
          <LoanApproveReject
            purpose={reviewParams.purpose}
            amount={details.amount}
            date={details.date}
            reason={details.reason}
          />
        </div>
        <Balances {...balances} />
        <RiskIndicator />
        <div className="flex flex-2">
          <TransactionBehaviour />
          <CreditDebitsTxn />
        </div>
      </div>
    </div>
  );
}

const CustomerProfile = (props: {
  name: string;
  banks: {
    accNo: string;
    type: string;
    isSelected: boolean;
  }[];
}) => {
  const UserCard = () => {
    return (
      <div className="bg-secondaryBg text-secondary font-normal p-3 rounded">
        {props.name}
      </div>
    );
  };
  const BankCard = (bank: {
    accNo: string;
    type: string;
    isSelected: boolean;
  }) => {
    const selectedCss = "p-3 rounded bg-green-100";
    const unSelectedCss = "border-2 p-3 rounded ";
    return (
      <div className={bank.isSelected ? selectedCss : unSelectedCss}>
        <div className="text-sm">{bank.accNo}</div>
        <div className="text-xs">{bank.type}</div>
      </div>
    );
  };
  return (
    <div className="flex-1 space-y-1 ">
      <UserCard />
      {props.banks.map((b) => {
        return <BankCard {...b} />;
      })}
    </div>
  );
};

const Balances = (props: {
  currentBalance: string;
  totalCredits: string;
  totalDebits: string;
}) => {};

const LoanApproveReject = (props: {
  purpose: string;
  date: Date;
  amount: string;
  reason: string;
}) => {
  const DetailRow = (props: { title: string; value: string }) => {
    return (
      <div className="flex mt-2 justify-between">
        <div className="text-xs text-secondaryText font-normal">
          {props.title}
        </div>
        <div className="text-xs">{props.value}</div>
      </div>
    );
  };
  return (
    <div className="flex-1 flex flex-col bg-white p-3  rounded-lg">
      <div className="self-start text-xs bg-secondaryBg p-2  rounded">
        {props.purpose}
      </div>
      <DetailRow title={"AMOUNT"} value={props.amount} />
      <DetailRow title={"DATE"} value={props.date.toLocaleString()} />
      <DetailRow title={"REASON"} value={props.reason} />
      <div className="flex space-x-4 mt-4">
        <div className="text-sm text-white bg-approve py-2 px-4 rounded-lg">
          Approve request
        </div>
        <div className="text-sm text-white bg-reject py-2 px-4 rounded-lg">
          Reject
        </div>
      </div>
    </div>
  );
};

const TransactionBehaviour = () => {
  return <div></div>;
};

const CreditDebitsTxn = () => {
  return <div></div>;
};
