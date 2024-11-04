"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [requests, setRequests] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let details = localStorage.getItem("user-details");
    if (details) {
      setRequests(JSON.parse(details));
    }
  }, []);
  // const requests = [
  //   {
  //     name: "Daksh Garg",
  //     date: new Date(),
  //     phone: "+91-1234567890",
  //     amount: "INR 12,00,000.12",
  //     purpose: "Loan for vehicle purchase",
  //   },
  //   {
  //     name: "Daksh Garg",
  //     date: new Date(),
  //     phone: "+91-1234567890",
  //     amount: "INR 12,00,000.12",
  //     purpose: "Loan for vehicle purchase",
  //   },
  //   {
  //     name: "Daksh Garg",
  //     date: new Date(),
  //     phone: "+91-1234567890",
  //     amount: "INR 12,00,000.12",
  //     purpose: "Loan for vehicle purchase",
  //   },
  // ];

  const [selectedOption, setSelectedOption] = useState<string>("INCOMING");
  const [selectedOption2, setSelectedOption2] = useState<string>("All");

  return requests ? (
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
    purpose: string;
  }[];
}) => {
  const tableHeadingCss = "pl-2 text-xs text-secondaryText font-medium";
  const tableDataCss = "pl-2 pr-4 max-w-36 py-2";
  const router = useRouter();
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
              <tr
                className="text-xs bg-white"
                onClick={() => router.push("/dashboard")}
              >
                <td className={tableDataCss + " font-semibold"}>{p.name}</td>
                <td className={tableDataCss}>{new Date().toLocaleString()}</td>
                <td className={tableDataCss}>{p.phone}</td>
                <td className={tableDataCss}>{p.amount}</td>
                <td className={tableDataCss}>{p.purpose}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
