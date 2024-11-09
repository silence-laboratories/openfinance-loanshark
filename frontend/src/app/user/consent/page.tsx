"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, CLIENT_URL } from "../../constants";

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Consent() {
  const router = useRouter();
  const [screen, setScreen] = useState("1");

  const searchParams = useSearchParams();

  const phone = searchParams.get("phone");
  const id = searchParams.get("id");

  const selectedBarCss = "h-2 bg-gray-400 rounded flex-1";
  const OtherBarCss = "h-2 bg-gray-200 rounded flex-1";
  const successBarCss = "h-2 bg-approve rounded flex-1";

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

  const startDate = "21st October, 2023";
  const endDate = "9th November, 2024";
  const expiryEndDate = "9th November, 2025";

  const process = [
    {
      title: "Time Period: Last 12 months",
      subtitle: `Fetch your financial data from ${startDate} to ${endDate}`,
    },
    {
      title: "Expiry: 12 months",
      subtitle: `This permission will last till ${expiryEndDate}.`,
    },
    {
      title: "Data Fetching: Daily",
      subtitle: "Data will be fetched daily.",
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
    <div className="flex flex-col">
      <div className="p-4 bg-user2 bg-opacity-50">
        Information & data request
      </div>
      {screen == "1" && (
        <div className="bg-user2 p-4">
          <div className="text-user3">Purpose</div>
          <div className="text-lg">
            Customer spending patterns, budget or other reportings
          </div>
          <div className="text-user3 mt-4">Purpose Code</div>
          <div className="text-lg">102</div>
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
            Secure Loans is requesting access to the following insights
          </div>
          <Insights insights={insights} />
          <div className="text-gray-500 p-4">
            This is how Secure Loans will process your data
          </div>
          <InsightsProcess process={process} />
          {/* <div className="cursor-pointer self-start ml-4 p-2 rounded-lg bg-gray-800 text-white">
            Modify permissions
          </div> */}
        </>
      )}
      {screen == "2" && (
        <>
          <div className="self-center text-lg px-4">SELECT ACCOUNTS</div>
          <div className="self-center text-gray-500 px-4">
            Select which accounts Secure Loans can fetch information from.
          </div>
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
        </>
      )}
      <div className="self-start mx-4 mt-4 p-2 rounded-lg bg-userWarn1 text-userWarn2">
        Secure Loans will not be able to see specific transaction data from
        accounts you share. It will only have access to the insights & trends.
      </div>
      <div className="self-start mx-4 mt-4 p-2 rounded-lg bg-userWarn1 text-userWarn2">
        You can cancel all the permissions whenever you want
      </div>
      <div className="flex mx-4 mt-12 space-x-4">
        <div
          className="flex flex-1 p-4 rounded-lg text-white text-lg font-semibold justify-center cursor-pointer bg-approve"
          data-modal-target="static-modal"
          data-modal-toggle="static-modal"
          onClick={() => {
            if (screen == "1") setScreen("2");
            else {
              consentApprove();
            }
          }}
        >
          {screen == "1" ? "Select accounts" : "One-tap approve"}
        </div>
        <div
          className=" bg-reject bg-opacity-20 rounded-lg text-reject  text-lg font-semibold p-4 cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
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
      "flex p-3 rounded bg-green-100 border-2 border-green-100 justify-between";
    const unSelectedCss = "flex border-2 p-3 rounded justify-between";
    return (
      <div className={props.bank.isSelected ? selectedCss : unSelectedCss}>
        <div className="flex">
          <div className="flex align-middle mr-4 items-center">
            <img
              src="https://companieslogo.com/img/orig/HDB-bb6241fe.png"
              style={{ width: "18px", height: "18px" }}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="text-lg">{props.bank.accNo}</div>
            <div className="">{props.bank.type}</div>
          </div>
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
