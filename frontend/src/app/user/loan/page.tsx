"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, CLIENT_URL } from "../../constants";

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loanStatus, setLoanStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [detailsJSON, setDetailsJSON] = useState<any[] | null>(null);

  const timePerionClass = "p-2 bg-violet-50 text-xs rounded-lg";

  // let detailsJSON = null;

  // let details = localStorage.getItem("user-details");
  // if (details) {
  //   detailsJSON = JSON.parse(details)[0];
  // }

  useEffect(() => {
    if (searchParams.get("phone") && searchParams.get("id")) {
      getData(searchParams.get("phone"), searchParams.get("id"));
    }
  }, [searchParams]);

  const getData = async (phone: String | null, id: String | null) => {
    if (phone) {
      let { data: user, error } = await supabase
        .from("user")
        .select("*")
        // Filters
        .eq("id", id);
      if (user) {
        let userData = user[0];
        setName(userData["name"]);
        setPhone(userData["phone"]);
        setSelectedPurpose(userData["purpose"]);
        setSelectedAmount(userData["amount"]);
        setLoanStatus(userData["loanStatus"]);
        setDetailsJSON(user[0]);
      }
    }
  };

  const checkStatus = async () => {
    setIsLoading(true);
    let id = searchParams.get("id");
    let { data: user, error } = await supabase
      .from("user")
      .select("*")
      // Filters
      .eq("id", id);
    if (user) {
      let userData = user[0];
      setName(userData["name"]);
      setPhone(userData["phone"]);
      setSelectedPurpose(userData["purpose"]);
      setSelectedAmount(userData["amount"]);
      setLoanStatus(userData["loanStatus"]);
      setIsLoading(false);
      setDetailsJSON(user[0]);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex flex-col min-w-80 w-2/5 h-screen mt-10">
        <div className="text-2xl font-bold">Secure Loans</div>
        <div className="border-b-2 mt-4 mb-4" />
        {detailsJSON ? (
          <>
            <div className="text-xl font-bold">Loan request submitted</div>
            <div className="text-xs mt-2 text-slate-500">
              Your loan request has been submitted successfully.
            </div>
            <div className="border-b-2 mt-4 mb-4" />
            <div className="flex space-x-4 mb-4">
              {!isLoading ? (
                <div
                  className="text-sm text-green bg-transparent border border-green-500 py-2 px-4 rounded-lg cursor-pointer"
                  onClick={() => checkStatus()}
                >
                  Refresh
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
              )}
              <div
                className="text-sm text-white bg-approve py-2 px-4 rounded-lg cursor-pointer"
                onClick={() => router.push("/")}
              >
                New loan
              </div>
            </div>
            <div>Borrower Name</div>
            <div>{name}</div>
            <div className="mt-8">Phone Number</div>
            <div>{phone}</div>
            <div className="mt-8">Amount</div>
            <div>{selectedAmount}</div>
            <div className="mt-8">Purpose</div>
            <div>{selectedPurpose}</div>
            <div className="mt-8">Status</div>
            <div className="flex space-x-4">
              <div
                className={`text-sm text-white py-2 px-8 rounded-lg ${
                  loanStatus === "PENDING"
                    ? "bg-blue-400"
                    : loanStatus === "APPROVED"
                    ? "bg-emerald-600"
                    : "bg-red-400"
                }`}
              >
                {loanStatus}
              </div>
            </div>
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
    </div>
  );
}
