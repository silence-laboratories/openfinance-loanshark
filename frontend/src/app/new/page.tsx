"use client";
import { useState } from "react";

export default function Page() {
  const requests = [
    {
      name: "Daksh Garg",
      date: new Date(),
      phone: "+91-1234567890",
      amount: "INR 12,00,000.12",
      reason: "Loan for vehicle purchase",
    },
    {
      name: "Daksh Garg",
      date: new Date(),
      phone: "+91-1234567890",
      amount: "INR 12,00,000.12",
      reason: "Loan for vehicle purchase",
    },
    {
      name: "Daksh Garg",
      date: new Date(),
      phone: "+91-1234567890",
      amount: "INR 12,00,000.12",
      reason: "Loan for vehicle purchase",
    },
  ];

  const [selectedOption, setSelectedOption] = useState<string>("INCOMING");
  const [selectedOption2, setSelectedOption2] = useState<string>("All");

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className=" min-w-fit w-2/3">
        <Header1
          options={["INCOMING", "PROCESSING", "CANCELLED", "REJECTED"]}
          selectedOption={selectedOption}
          updateOption={setSelectedOption}
        />
        <Header2
          options={[
            "All",
            "Loan Approvals",
            "Wealth Management",
            "Income Verification",
            "Account Monitoring",
          ]}
          selectedOption={selectedOption2}
          updateOption={setSelectedOption2}
        />
        <div className="border-b-2 mt-4" />
        <RequestTable requests={requests} />
      </div>
    </div>
  );
}

const Header1 = (props: {
  options: string[];
  selectedOption: string;
  updateOption: (value: string) => void;
}) => {
  const selectedCss =
    "text-sm border-b-2 border-b-primary py-2 px-8 text-primary cursor-pointer";
  const unselectedCss =
    "text-sm border-b-2 border-b-primary py-2 px-8 text-primary border-opacity-20 text-opacity-60 cursor-pointer";
  return (
    <div className="flex mt-4">
      {props.options.map((e) => {
        return (
          <div
            className={props.selectedOption === e ? selectedCss : unselectedCss}
            onClick={() => {
              props.updateOption(e);
            }}
            key={e}
          >
            {e}
          </div>
        );
      })}
    </div>
  );
};

const Header2 = (props: {
  options: string[];
  selectedOption: string;
  updateOption: (value: string) => void;
}) => {
  const selectedCss =
    "text-xs cursor-pointer bg-secondary mr-2 p-2 rounded text-white";
  const unselectedCss =
    "text-xs cursor-pointer bg-secondary bg-opacity-10 mr-2 p-2 rounded text-secondaryText";
  return (
    <div className="flex mt-4">
      {props.options.map((e) => {
        return (
          <div
            className={props.selectedOption === e ? selectedCss : unselectedCss}
            onClick={() => {
              props.updateOption(e);
            }}
            key={e}
          >
            {e}
          </div>
        );
      })}
    </div>
  );
};

const RequestTable = (props: {
  requests: {
    name: string;
    date: Date;
    phone: string;
    amount: string;
    reason: string;
  }[];
}) => {
  const tableHeadingCss = "pl-2 text-xs text-secondaryText font-medium";
  const tableDataCss = "pl-2 pr-4 max-w-36 py-2";
  return (
    <div className="mt-4">
      <table className="text-left border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th scope="col" className={tableHeadingCss}>
              NAME
            </th>
            <th scope="col" className={tableHeadingCss}>
              DATE
            </th>
            <th scope="col" className={tableHeadingCss}>
              PHONE
            </th>
            <th scope="col" className={tableHeadingCss}>
              AMOUNT
            </th>
            <th scope="col" className={tableHeadingCss}>
              REASON
            </th>
          </tr>
        </thead>
        <tbody>
          {props.requests.map((p) => {
            return (
              <tr className="text-xs bg-white">
                <td className={tableDataCss + " font-semibold"}>{p.name}</td>
                <td className={tableDataCss}>{p.date.toLocaleString()}</td>
                <td className={tableDataCss}>{p.phone}</td>
                <td className={tableDataCss}>{p.amount}</td>
                <td className={tableDataCss}>{p.reason}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
