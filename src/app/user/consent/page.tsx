"use client";
import { useState } from "react";

export default function Consent() {
  const [screen, setScreen] = useState("2");

  const selectedBarCss = "h-2 bg-gray-400 rounded flex-1";
  const OtherBarCss = "h-2 bg-gray-200 rounded flex-1";
  const successBarCss = "h-2 bg-approve rounded flex-1";

  const insights = [
    {
      title: "Balances & cash flow",
      subtitle:
        "Insightly will be able to see insights from all your transactions.",
    },
    {
      title: "Risk indicators",
      subtitle:
        "Insightly will be able to see overdraft ratio, bounced & cleared cheques, and pull credit information.",
    },
    {
      title: "Expense categorisation",
      subtitle:
        "Insightly will be able to see category wise expenses & insights.",
    },
  ];

  const startDate = "21st October";
  const endDate = "21st November";

  const process = [
    {
      title: "Time Period: Last 6 months",
      subtitle: `Insightly will be able to see all transactions carried between ${startDate} - ${endDate}`,
    },
    {
      title: "Expiry: 1 month",
      subtitle: `This permission will last till ${endDate}.`,
    },
    {
      title: "Data Fetching: Daily",
      subtitle: "Insightly will fetch data daily.",
      warning: "This seems higher when compared to similar apps.",
    },
  ];

  const [userBanks, setUserBanks] = useState([
    {
      accNo: "HDFC0123456789",
      type: "Savings account",
      isSelected: true,
    },
    {
      accNo: "HDFC0123456987",
      type: "Savings account",
      isSelected: false,
    },
  ]);
  return (
    <div className="flex flex-col">
      <div className="p-4 bg-user2 bg-opacity-50">
        Information & data request
      </div>
      {screen == "1" && (
        <div className="bg-user2 p-4">
          <div className="text-user3">Purpose</div>
          <div className="text-lg">To process your loan application</div>
          <div className="text-user3 mt-4">Purpose Code</div>
          <div className="text-lg">Loan Underwriting CT001</div>
        </div>
      )}
      <div className="flex space-x-8 p-8">
        <div className={screen == "1" ? selectedBarCss : successBarCss} />
        <div className={screen == "2" ? selectedBarCss : OtherBarCss} />
      </div>
      {screen == "1" && (
        <>
          <div className="self-center text-lg">APPROVE PERMISSIONS</div>
          <div className="self-center text-gray-500">
            Verify all details before approving
          </div>
          <div className="text-gray-500 p-4">
            Insightly is requesting access to the following insights
          </div>
          <Insights insights={insights} />
          <div className="text-gray-500 p-4">
            This is how Insightly will process your data
          </div>
          <InsightsProcess process={process} />
          <div className="cursor-pointer self-start ml-4 p-2 rounded-lg bg-gray-800 text-white">
            Modify permissions
          </div>
        </>
      )}
      {screen == "2" && (
        <>
          <div className="self-center text-lg px-4">SELECT ACCOUNTS</div>
          <div className="self-center text-gray-500 px-4">
            Select which accounts Insightly can fetch information from.
          </div>
          <Banks
            banks={userBanks}
            update={(accNo, value) => {
              console.log(accNo, value);
              setUserBanks((prev) => {
                const b = prev.find((b) => b.accNo == accNo);
                if (b) b.isSelected = value;
                return [...prev];
              });
            }}
          />
        </>
      )}
      <div className="self-start mx-4 mt-4 p-2 rounded-lg bg-userWarn1  text-userWarn2">
        Insightly will not be able to see specific transaction data from
        accounts you share. It will only have access to the insights & trends.
      </div>
      <div className="self-start ml-4 mt-4 p-2 rounded-lg bg-gray-100  ">
        You can cancel all permissions when you want.
      </div>
      <div className="flex mx-4 mt-12 space-x-4">
        <div
          className="flex bg-approve flex-1 p-4 rounded-lg text-white text-lg font-semibold justify-center"
          onClick={() => {
            if (screen == "1") setScreen("2");
            else {
              // Approve logic
            }
          }}
        >
          {screen == "1" ? "Select accounts" : "One-tap approve"}
        </div>
        <div className=" bg-reject bg-opacity-20 rounded-lg text-reject  text-lg font-semibold p-4">
          Reject
        </div>
      </div>
      <div className="mt-12 " />
    </div>
  );
}

const Insights = (props: {
  insights: { title: string; subtitle: string }[];
}) => {
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
    <div className="mx-4 ">
      {props.insights.map((i) => {
        return <InsightItem {...i} />;
      })}
    </div>
  );
};

const InsightsProcess = (props: {
  process: { title: string; subtitle: string; warning?: string }[];
}) => {
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
    <div className="mx-4 ">
      {props.process.map((i) => {
        return <ProcessItem {...i} />;
      })}
    </div>
  );
};

const Banks = (props: {
  banks: {
    accNo: string;
    type: string;
    isSelected: boolean;
  }[];
  update: (accNo: string, value: boolean) => void;
}) => {
  const BankCard = (props: {
    bank: {
      accNo: string;
      type: string;
      isSelected: boolean;
    };
    update: (accNo: string, value: boolean) => void;
  }) => {
    const selectedCss =
      "flex p-3 rounded bg-green-100 border-2 border-green-100";
    const unSelectedCss = "flex border-2 p-3 rounded ";
    return (
      <div className={props.bank.isSelected ? selectedCss : unSelectedCss}>
        <div className="flex-1 flex flex-col">
          <div className="text-lg">{props.bank.accNo}</div>
          <div className="">{props.bank.type}</div>
        </div>
        <input
          type="checkbox"
          checked={props.bank.isSelected}
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
