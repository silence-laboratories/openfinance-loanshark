"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../../constants";

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Consent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState("0");
  const [otp, setOtp] = useState("");

  const selectedBarCss = "h-2 bg-gray-400 rounded flex-1";
  const OtherBarCss = "h-2 bg-gray-200 rounded flex-1";
  const successBarCss = "h-2 bg-approve rounded flex-1";

  const phone = searchParams.get("phone");
  const id = searchParams.get("id");
  
  const insights = [
    {
      title: "Balances & cash flow",
      subtitle:
        "Secure Loans will be able to see insights from all your transactions.",
    },
    {
      title: "Risk indicators",
      subtitle:
        "Secure Loans will be able to see overdraft ratio, bounced & cleared cheques, and pull credit information.",
    },
    {
      title: "Expense categorisation",
      subtitle:
        "Secure Loans will be able to see category wise expenses & insights.",
    },
  ];

  const startDate = "21st October";
  const endDate = "21st November";

  const process = [
    {
      title: "Time Period: Last 6 months",
      subtitle: `Secure Loans will be able to see all transactions carried between ${startDate} - ${endDate}`,
    },
    {
      title: "Expiry: 1 month",
      subtitle: `This permission will last till ${endDate}.`,
    },
    {
      title: "Data Fetching: Daily",
      subtitle: "Secure Loans will fetch data daily.",
      warning: "This seems higher when compared to similar apps.",
    },
  ];

  const [userBanks, setUserBanks] = useState([
    {
      accNo: "XXXXX123",
      type: "Savings account",
      isSelected: false,
      bankName: "ACME Bank",
    },
    {
      accNo: "XXXXX789",
      type: "Current account",
      isSelected: false,
      bankName: "IPSUM Bank",
    },
  ]);

  const consentApprove = async () => {
    const { data, error } = await supabase
      .from("user")
      .update({ bankAccounts: userBanks })
      .eq("id", id)
      .select();
    if (data) {
      router.push(`/user/loan?phone=${phone}&id=${id}`);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center border-b-2 w-screen h-16">
        <div className="text-2xl">Mock AA Consent screens</div>
      </div>
      <div className="flex flex-col p-8">
        <div className="flex space-x-8 mb-4">
          <div className={screen === "0" ? selectedBarCss : screen === "1" || screen === "2" ? successBarCss : OtherBarCss} />
          <div className={screen === "1" ? selectedBarCss : screen === "2" ? successBarCss : OtherBarCss} />
          <div className={screen === "2" ? selectedBarCss : OtherBarCss} />
        </div>
        {screen == "0" && (
          <>
            <div className="self-center text-lg">Step 0: LOGIN</div>
            <div className="self-center text-gray-500 mb-4">
              OTP sent to {phone}
            </div>
            <div className="mt-8">Enter 6 digit OTP</div>
            <input
              className="bg-violet-100 rounded-md focus:outline-none px-3 py-2 placeholder:text-sm mt-1 text-sm"
              type="number"
              placeholder="123456"
              value={otp}
              onChange={(event: any) => {
                setOtp(event.target.value);
              }}
            />
            <button className="bg-approve text-white px-4 py-2 rounded-md mt-4" onClick={() => setScreen("1")}>
              Verify
            </button>
          </>
        )}
        {screen == "1" && (
          <>
            <div className="self-center text-lg ">Step 1: VERIFY DETAILS</div>
            <div className="self-center text-gray-500 mb-4">
              Verify all details before approving
            </div>
            <div className="p-4 bg-user2 bg-opacity-50">
              Information & data request
            </div>
            <div className="bg-user2 p-4">
              <div className="text-user3">Purpose</div>
              <div className="text-lg">To process your loan application</div>
              <div className="text-user3 mt-4">Purpose Code</div>
              <div className="text-lg">Loan Underwriting CT001</div>
            </div>
            <div className="border-b-2 mt-4 mb-4" />
            <Insights insights={insights} />
            <div className="border-b-2 mt-4 mb-4" />
            <InsightsProcess process={process} />
            <div className="border-b-2 mt-4 mb-4" />
            <div className="self-start mx-4 mt-4 p-2 rounded-lg bg-userWarn1  text-userWarn2">
              Secure Loans will not be able to see specific transaction data from
              accounts you select. It will only have access to the insights & trends.
            </div>
            <div className="self-start ml-4 mt-4 p-2 rounded-lg bg-gray-100  ">
              You can cancel all permissions when you want.
            </div>
            <div className="flex mx-4 mt-12 space-x-4">
              <div
                className="flex bg-approve flex-1 p-4 rounded-lg text-white text-lg font-semibold justify-center cursor-pointer"
                onClick={() => {
                  setScreen("2");
                }}
              >
                Select accounts
              </div>
              <div className=" bg-reject bg-opacity-20 rounded-lg text-reject  text-lg font-semibold p-4 cursor-pointer">
                Reject
              </div>
            </div>
            <div className="mt-12 " />
          </>
        )}
        {screen == "2" && (
          <>
            <div className="self-center text-lg">Step 2: SELECT ACCOUNTS</div>
            <div className="self-center text-gray-500 mb-4">
              Select your accounts to share data
            </div>
            <div className="border-b-2 mt-4 mb-4" />
            <div className="text-gray-500 mb-2 pl-3">Select bank accounts to share</div>
            <Banks
              banks={userBanks}
              update={(accNo, value) => {
                setUserBanks((prev) => {
                  const b = prev.find((b) => b.accNo == accNo);
                  if (b) b.isSelected = value;
                  return [...prev];
                });
              }}
            />
            <div className="self-start mx-4 mt-4 p-2 rounded-lg bg-userWarn1  text-userWarn2">
              Secure Loans will not be able to see specific transaction data from
              accounts you select. It will only have access to the insights & trends.
            </div>
            <div className="self-start ml-4 mt-4 p-2 rounded-lg bg-gray-100  ">
              You can cancel all permissions when you want.
            </div>
            <div className="flex mx-4 mt-12 space-x-4">
              <div
                className="flex bg-approve flex-1 p-4 rounded-lg text-white text-lg font-semibold justify-center cursor-pointer"
                onClick={() => {
                  consentApprove();
                }}
              >
                One-tap approve
              </div>
              <div className=" bg-reject bg-opacity-20 rounded-lg text-reject  text-lg font-semibold p-4 cursor-pointer" onClick={() => {
                router.push("/");
              }}>
                Reject
              </div>
            </div>
            <div className="mt-12 " />
          </>
        )}
      </div>
    </>
  );
}

const Insights = (props: {
  insights: { title: string; subtitle: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const InsightItem = (props: { title: string; subtitle: string }) => {
    return (
      <div className="flex p-4 mb-4 bg-gray-200 rounded">
        <div className="flex flex-col">
          <div className="text-lg">{props.title}</div>
          <div className="text-gray-500">{props.subtitle}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-4">
      <div
        className="flex justify-between items-center cursor-pointer mb-2 mt-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-gray-500">Following Insights are requested</div>
        <div className="text-gray-500">{isOpen ? '▼' : '▶'}</div>
      </div>
      {isOpen && (
        <div className="mt-2">
          {props.insights.map((i) => {
            return <InsightItem key={i.title} {...i} />;
          })}
        </div>
      )}
    </div>
  );
};

const InsightsProcess = (props: {
  process: { title: string; subtitle: string; warning?: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const ProcessItem = (props: {
    title: string;
    subtitle: string;
    warning?: string;
  }) => {
    return (
      <div className="flex p-4 mb-4 bg-gray-200 rounded">
        <div className="flex flex-col">
          <div className="text-lg">{props.title}</div>
          <div className="text-gray-500">{props.subtitle}</div>
          {props.warning && (
            <div className="text-red-500 mt-2">{props.warning}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-4">
      <div
        className="flex justify-between items-center cursor-pointer mb-2 mt-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-gray-500">How will Secure Loans process your data</div>
        <div className="text-gray-500">{isOpen ? '▼' : '▶'}</div>
      </div>
      {isOpen && (
        <div className="mt-2">
          {props.process.map((i) => {
            return <ProcessItem key={i.title} {...i} />;
          })}
        </div>
      )}
    </div>
  );
};

const Banks = (props: {
  banks: {
    accNo: string;
    type: string;
    isSelected: boolean;
    bankName: string;
  }[];
  update: (accNo: string, value: boolean) => void;
}) => {
  const BankCard = (props: {
    bank: {
      accNo: string;
      type: string;
      isSelected: boolean;
      bankName: string;
    };
    update: (accNo: string, value: boolean) => void;
  }) => {
    const selectedCss =
      "flex p-3 rounded bg-green-100 border-2 border-green-100 mb-4";
    const unSelectedCss = "flex border-2 p-3 rounded mb-4";
    return (
      <div className={props.bank.isSelected ? selectedCss : unSelectedCss}>
        <div className="flex-1 flex flex-col">
          <div className="text-lg">{props.bank.bankName}</div>
          <div className="">{props.bank.type}</div>
          <div className="text-gray-500">{props.bank.accNo}</div>
        </div>
        <input
          type="checkbox"
          checked={props.bank.isSelected}
          className="cursor-pointer"
          onChange={() => {
            props.update(props.bank.accNo, !props.bank.isSelected);
          }}
        />
      </div>
    );
  };

  return (
    <div className="m-4  space-y-1 ">
      {props.banks.map((b) => {
        return <BankCard bank={b} update={props.update} />;
      })}
    </div>
  );
};