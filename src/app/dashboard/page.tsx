"use client";
import Chart from "react-google-charts";
import RiskIndicator from "../_components/riskIndicator";

export default function Dashboard() {
  // const details = {
  //   name: "Daksh Garg",
  //   date: "04/11/2024, 20:54:53",
  //   phone: "+91-1234567890",
  //   amount: "INR 12,00,000.12",
  //   purpose: "Loan for vehicle purchase",
  // };

  let details = null;

  let detailsJSON = localStorage.getItem("user-details");
  if (detailsJSON) {
    details = JSON.parse(detailsJSON)[0];
  }

  const reviewParams = {
    reason: "Loan Underwriting CT001",
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

  const balances = {
    currentBalance: "1224724",
    totalCredits: "1224624",
    totalDebits: "1224724",
  };

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

  const endOfDayBalances = [
    ["", "Balance"],
    ["Jan", 404],
    ["Feb", 500],
    ["Mar", 650],
    ["Apr", 900],
    ["May", 1030],
    ["Jun", 1200],
    ["Jul", 1250],
    ["Aug", 1030],
    ["Sep", 700],
    ["Oct", 500],
    ["Nov", 550],
    ["Dec", 500],
  ];

  const endOfMonthBalances = [
    ["", "Balance"],
    ["Jan", 404],
    ["Feb", 500],
    ["Mar", 650],
    ["Apr", 900],
    ["May", 1030],
    ["Jun", 1200],
    ["Jul", 1250],
    ["Aug", 1030],
    ["Sep", 700],
    ["Oct", 500],
    ["Nov", 550],
    ["Dec", 500],
  ];

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex flex-col min-w-80 w-4/5 h-screen">
        <div className="text-xs mt-8"> CUSTOMER PROFILE</div>
        <div className="flex mt-4 space-x-4 ">
          {details ? (
            <>
              <CustomerProfile name={details.name} banks={userBanks} />
              <LoanApproveReject
                reason={reviewParams.reason}
                amount={details.amount}
                date={new Date().toLocaleString()}
                purpose={details.purpose}
              />
            </>
          ) : (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
        <Balances {...balances} />
        <ExpenseGraphs
          endOfDayBalances={endOfDayBalances}
          endOfMonthBalances={endOfMonthBalances}
        />
        <RiskIndicator riskIndicators={riskIndicators} />
        <div className="mt-8 flex space-x-4">
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
      <div className="bg-bg4 text-secondary font-normal p-3 rounded">
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
}) => {
  const BalanceItem = (props: { title: string; value: string }) => {
    return (
      <div className="flex flex-col">
        <div className="text-xs text-gray-500">{props.title}</div>
        <div className="">{"₹ " + props.value}</div>
      </div>
    );
  };

  return (
    <div className="flex space-x-4 mt-8">
      <BalanceItem title={"CURRENT BALANCE"} value={props.currentBalance} />
      <BalanceItem title={"TOTAL CREDITS"} value={props.totalCredits} />
      <BalanceItem title={"TOTAL DEBITS"} value={props.totalDebits} />
    </div>
  );
};

const LoanApproveReject = (props: {
  reason: string;
  date: string;
  amount: string;
  purpose: string;
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
      <div className="self-start text-xs bg-bg4 p-2  rounded">
        {props.reason}
      </div>
      <DetailRow title={"AMOUNT"} value={props.amount} />
      <DetailRow title={"DATE"} value={props.date} />
      <DetailRow title={"PURPOSE"} value={props.purpose} />
      <div className="flex space-x-4 mt-4">
        <div
          className="text-sm text-white bg-approve py-2 px-4 rounded-lg"
          onClick={() => loanStatus("approve")}
        >
          Approve request
        </div>
        <div
          className="text-sm text-white bg-reject py-2 px-4 rounded-lg"
          onClick={() => loanStatus("reject")}
        >
          Reject
        </div>
      </div>
    </div>
  );
};

const TransactionBehaviour = () => {
  return (
    <div className="flex-1">
      <div>TRANSACTION BEHAVIOUR</div>
      <Chart
        chartType="PieChart"
        data={[
          ["Task", "Hours per Day"],
          ["label", 2],
          ["label", 2],
          ["label", 6],
        ]}
        options={{ title: "Expense categorisation" }}
      />
    </div>
  );
};

const CreditDebitsTxn = () => {
  return <div className="flex-1"></div>;
};

const ExpenseGraphs = (props: {
  endOfDayBalances: any;
  endOfMonthBalances: any;
}) => {
  return (
    <div className="flex space-x-4 mt-4">
      <div className="flex-1">
        <Chart
          chartType="LineChart"
          data={props.endOfDayBalances}
          options={{ title: "End of day balances" }}
          legendToggle
        />
      </div>
      <div className="flex-1">
        <Chart
          chartType="LineChart"
          data={props.endOfMonthBalances}
          options={{ title: "End of month balances" }}
          legendToggle
        />
      </div>
    </div>
  );
};
