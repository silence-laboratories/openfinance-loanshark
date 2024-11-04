"use client";
import Chart from "react-google-charts";
import RiskIndicator from "../_components/riskIndicator";

export default function Dashboard() {
  const details = {
    name: "Daksh Garg",
    date: "04/11/2024, 20:54:53",
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
          <CustomerProfile name={details.name} banks={userBanks} />
          <LoanApproveReject
            purpose={reviewParams.purpose}
            amount={details.amount}
            date={details.date}
            reason={details.reason}
          />
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
  purpose: string;
  date: string;
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
      <div className="self-start text-xs bg-bg4 p-2  rounded">
        {props.purpose}
      </div>
      <DetailRow title={"AMOUNT"} value={props.amount} />
      <DetailRow title={"DATE"} value={props.date} />
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
