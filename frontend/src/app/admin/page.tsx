"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, CLIENT_URL } from "../constants";

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Page() {
  const [requests, setRequests] = useState<any[] | null>(null);
  const [filterRequests, setFilterRequests] = useState<any[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    getData();
  }, [router]);

  const getData = async () => {
    let { data: user, error } = await supabase.from("user").select("*");

    if (user) {
      setFilterRequests(user.filter((u) => u.loanStatus === "PENDING"));
      setRequests(user);
    }
  };

  const [selectedOption, setSelectedOption] = useState<String>("PENDING");

  const selectHeader = (option: String) => {
    if (requests) {
      setFilterRequests(requests.filter((r) => r.loanStatus === option));
      setSelectedOption(option);
    }
  };

  return (
    <>
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <div className="flex flex-col min-w-80 w-3/5 h-screen mt-10">
          <div className="text-2xl font-bold">Secure Loans Admin</div>
          <div className="border-b-2 mt-4 mb-4" />
          {requests ? (
            <div className="items-center">
              <div>
                <Header1
                  options={["PENDING", "APPROVED", "REJECTED"]}
                  selectedOption={selectedOption}
                  updateOption={selectHeader}
                />
                {/* <Header2
                  options={[
                    "All",
                    "Loan Approvals",
                    "Wealth Management",
                    "Income Verification",
                    "Account Monitoring",
                  ]}
                  selectedOption={selectedOption2}
                  updateOption={setSelectedOption2}
                /> */}
                {/* <div className="border-b-2 mt-4" /> */}
                <RequestTable requests={filterRequests} />
              </div>
            </div>
          ) : (
            <div role="status">
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
      ;
    </>
  );
}

const Header1 = (props: {
  options: string[];
  selectedOption: String;
  updateOption: (value: string) => void;
}) => {
  const selectedCss =
    "text-sm border-b-2 border-b-primary py-2 px-8 text-primary cursor-pointer w-full text-center";
  const unselectedCss =
    "text-sm border-b-2 border-b-primary py-2 px-8 text-primary border-opacity-20 text-opacity-60 cursor-pointer w-full text-center";
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

const RequestTable = (props: { requests: any[] | null }) => {
  const tableHeadingCss =
    "pl-2 text-xs text-secondaryText font-medium border border-gray-400 border-style-solid border-2 p-2 bg-secondary text-white";
  const tableDataCss =
    "pl-2 pr-4 max-w-36 py-2 border border-gray-400 border-style-solid border-2";
  const router = useRouter();
  return (
    <div className="mt-4">
      {props.requests && props.requests.length === 0 ? (
        <div className="text-left w-full bg-orange-200 text-orange-700 py-2 px-2 rounded text-center">
          No records found
        </div>
      ) : (
        <table className="text-left w-full border-collapse">
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
            {props.requests &&
              props.requests.map((p) => {
                return (
                  <tr
                    className="text-xs bg-white cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/admin/dashboard?phone=${p.phone}&id=${p.id}`
                      )
                    }
                  >
                    <td className={tableDataCss + " font-semibold"}>
                      {p.name}
                    </td>
                    <td className={tableDataCss}>
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                    <td className={tableDataCss}>{p.phone}</td>
                    <td className={tableDataCss}>{p.amount}</td>
                    <td className={tableDataCss}>{p.purpose}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};
