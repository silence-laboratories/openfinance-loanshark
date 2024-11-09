"use client";
import Chart from "react-google-charts";
import RiskIndicator from "../../_components/riskIndicator";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, CLIENT_URL } from "../../constants";

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [details, setDetails] = useState<any[] | null>(null);

  useEffect(() => {
    let phone = searchParams.get("phone");
    let id = searchParams.get("id");
    getData(phone, id);
  }, [searchParams]);

  const getData = async (phone: String | null, id: String | null) => {
    let { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", id);
    if (user) {
      setDetails(user);
    }

    // let response = await fetch(`${CLIENT_URL}/api/fetch-insights`, {
    //   method: "POST",
    // });
    // let insights = await response.json();
  };

  const reviewParams = {
    reason: "Customer spending patterns, budget or other reportings - 102",
    timePeriod: "Last 12 months",
    frequency: "Daily",
    expiry: "12 months",
  };

  const balances = {
    currentBalance: "1,24,724",
    totalCredits: "2,43,624",
    totalDebits: "1,18,900",
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
      info: "Cheque bounce is a sign of danger",
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
    ["Sun", 60400],
    ["Mon", 50000],
    ["Tue", 65000],
    ["Wed", 70000],
    ["Thur", 83000],
    ["Fri", 62000],
    ["Sat", 72500],
  ];

  const endOfMonthBalances = [
    ["", "Balance"],
    ["Jan", 40400],
    ["Feb", 50000],
    ["Mar", 65000],
    ["Apr", 90000],
    ["May", 103000],
    ["Jun", 120000],
    ["Jul", 125000],
    ["Aug", 103000],
    ["Sep", 70000],
    ["Oct", 50000],
    ["Nov", 55000],
    ["Dec", 50000],
  ];

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex flex-col min-w-80 w-4/5 h-screen">
        <div className="flex mt-10 items-center">
          <div
            className="text-sm text-black border border-green-500 py-2 px-4 rounded-lg cursor-pointer mr-6"
            onClick={() => router.push("/admin")}
          >
            Back
          </div>
          <div className="text-2xl font-bold">Secure Loans Admin</div>
        </div>
        <div className="border-b-2 mt-4 mb-4" />
        <div className="text-base mt-8"> CUSTOMER PROFILE</div>
        {details ? (
          <>
            <div className="flex mt-4 space-x-4 ">
              <CustomerProfile
                name={details[0].name}
                banks={details[0].bankAccounts}
              />
              <LoanApproveReject
                reason={reviewParams.reason}
                amount={details[0].amount}
                date={new Date(details[0].created_at).toLocaleString()}
                purpose={details[0].purpose}
                phone={details[0].phone}
                id={details[0].id}
                status={details[0].loanStatus}
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
          </>
        ) : (
          <div role="status" className="mt-6">
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600"
              style={{ fill: "#4E61AB" }}
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
    const selectedCss = "p-3 rounded bg-green-100 mt-4";
    return bank.isSelected ? (
      <div className={selectedCss}>
        <div className="flex">
          <div className="flex align-middle mr-4 items-center">
            <img
              src="https://companieslogo.com/img/orig/HDB-bb6241fe.png"
              style={{ width: "18px", height: "18px" }}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="text-sm">{bank.accNo}</div>
            <div className="text-xs">{bank.type}</div>
          </div>
        </div>
      </div>
    ) : null;
  };
  return (
    <div className="flex-1">
      <UserCard />
      <div className="mt-6 text-sm">Accounts selected</div>
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
  phone: string;
  id: string;
  status: string;
}) => {
  const router = useRouter();

  const loanStatus = async (status: String) => {
    const { data, error } = await supabase
      .from("user")
      .update({ loanStatus: status.toUpperCase() })
      .eq("id", props.id)
      .select();

    if (data) {
      router.push("/admin");
    }
  };

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
      <div className="text-sm mb-2">Purpose</div>
      <div className="self-start text-xs bg-bg4 p-2 rounded mb-6">
        {props.reason}
      </div>
      <DetailRow title={"AMOUNT"} value={props.amount} />
      <DetailRow title={"DATE"} value={props.date} />
      <DetailRow title={"PURPOSE"} value={props.purpose} />
      <div className="flex space-x-4 mt-4">
        {props.status === "PENDING" ? (
          <>
            <div
              className="text-sm text-white bg-approve py-2 px-4 rounded-lg cursor-pointer"
              onClick={() => loanStatus("approved")}
            >
              Approve request
            </div>
            <div
              className="text-sm text-white bg-reject py-2 px-4 rounded-lg cursor-pointer"
              onClick={() => loanStatus("rejected")}
            >
              Reject
            </div>
          </>
        ) : props.status === "APPROVED" ? (
          <div className="text-sm text-white bg-approve py-2 px-4 rounded-lg">
            Approved
          </div>
        ) : (
          <div className="text-sm text-white bg-reject py-2 px-4 rounded-lg">
            Rejected
          </div>
        )}
      </div>
    </div>
  );
};

const TransactionBehaviour = () => {
  return (
    <div className="flex-1 mb-6">
      <div>TRANSACTION BEHAVIOUR</div>
      <Chart
        chartType="PieChart"
        height={400}
        data={[
          ["Task", "Hours per Day"],
          ["Food", 200],
          ["Travel", 200],
          ["Entertainment", 600],
        ]}
        options={{ title: "Expense categorisation" }}
      />
    </div>
  );
};

const CreditDebitsTxn = () => {
  return (
    <div className="flex-1">
      <div className="mt-6 text-sm">Top 3 Credits</div>
      <div className="p-2 rounded bg-green-100 mt-4 flex justify-between">
        <div className="text-sm">COMPANY - 1st June, 2024</div>
        <div className="text-sm">₹ 1,87,000</div>
      </div>
      <div className="p-2 rounded bg-green-100 mt-4 flex justify-between">
        <div className="text-sm">John K - 12th August, 2024</div>
        <div className="text-sm">₹ 76,000</div>
      </div>
      <div className="p-2 rounded bg-green-100 mt-4 flex justify-between">
        <div className="text-sm">IMPS/AIR - 3rd February, 2024</div>
        <div className="text-sm">₹ 54,000</div>
      </div>
      <div className="mt-6 text-sm">Top 3 Debits</div>
      <div className="p-2 rounded bg-red-100 mt-4 flex justify-between">
        <div className="text-sm">Flipkart - 21st October, 2024</div>
        <div className="text-sm">₹ 54,000</div>
      </div>
      <div className="p-2 rounded bg-red-100 mt-4 flex justify-between">
        <div className="text-sm">Swiggy - 1st January, 2024</div>
        <div className="text-sm">₹ 24,000</div>
      </div>
      <div className="p-2 rounded bg-red-100 mt-4 flex justify-between">
        <div className="text-sm">U.S Polo - 17th May, 2024</div>
        <div className="text-sm">₹ 13,682</div>
      </div>
    </div>
  );
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
          options={{ title: "Avg. End of day balances" }}
        />
      </div>
      <div className="flex-1">
        <Chart
          chartType="LineChart"
          data={props.endOfMonthBalances}
          options={{ title: "End of month balances" }}
          legendToggle={false}
        />
      </div>
    </div>
  );
};
