"use client";
import Image from "next/image";
import { useState } from "react";

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://kucgqnqbntmdwzwuhayj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2dxbnFibnRtZHd6d3VoYXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MTI3MzgsImV4cCI6MjA0NDQ4ODczOH0.kNb5K8_k5w8PlfD6wrtDvIle3lRQI2f4hFtmiPtj3ss";
const supabase = createClient(supabaseUrl, supabaseKey);

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [consentHandle, setConsentHandle] = useState("");

  const timePerionClass = "p-2 bg-violet-50 text-xs rounded-lg";

  const submitConsent = async () => {
    setIsLoading(true);

    fetch("http://localhost:5000/api/v1/create-consent", {
      method: "POST",
    })
      .then((response) => response.json())
      .then(async (result) => {
        const { data, error } = await supabase
          .from("user")
          .insert([
            {
              name,
              phone,
              amount: selectedAmount,
              purpose: selectedPurpose,
              "loan-status": "Pending",
              "consent-handle": result.ConsentHandle,
            },
          ])
          .select();

        if (data) {
          router.push("/new");
        } else if (error) {
          console.error("Error inserting data:", error);
          // Handle error scenario
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex flex-col min-w-80 w-2/5 h-screen mt-10">
        <div className="text-2xl font-bold">Insightly Loans</div>
        <div className="text-xs mt-2 text-slate-500">
          Get instant loans upto INR 50,00,000
        </div>
        <div className="border-b-2 mt-4 mb-4" />
        <div>Borrower Name</div>
        <input
          className="bg-violet-100 rounded-md focus:outline-none px-3 py-2 placeholder:text-sm mt-1 text-sm"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(event: any) => {
            setName(event.target.value);
          }}
        />
        <div className="mt-8">Phone Number</div>
        <input
          className="bg-violet-100 rounded-md focus:outline-none px-3 py-2 placeholder:text-sm mt-1 text-sm"
          type="number"
          placeholder="9876543210"
          value={phone}
          onChange={(event: any) => {
            setPhone(event.target.value);
          }}
        />
        <div className="text-xs mt-2 text-slate-500">
          Enter 10 digit mobile number
        </div>

        <div className="mt-8">Amount</div>
        <select
          id="options"
          value={selectedAmount}
          onChange={(event) => {
            setSelectedAmount(event.target.value);
            console.log("Selected:", event.target.value);
          }}
          className="w-full bg-violet-100 rounded-md shadow-sm focus:outline-none px-2 py-3 mt-1 text-sm"
        >
          <option value="">Select an option</option>
          <option value="1-10">1 Lakh to 10 Lakhs</option>
          <option value="10-50">10 Lakhs to 50 Lakhs</option>
          <option value="50+">More than 50 Lakhs</option>
        </select>
        <div className="mt-8">Purpose</div>
        <select
          id="options"
          value={selectedPurpose}
          onChange={(event) => {
            setSelectedPurpose(event.target.value);
            console.log("Selected:", event.target.value);
          }}
          className="w-full bg-violet-100 rounded-md shadow-sm focus:outline-none px-2 py-3 mt-1 text-sm"
        >
          <option value="">Select an option</option>
          <option value="vehicle">Vehicle</option>
          <option value="education">Education</option>
          <option value="entrepreneurship">Entrepreneurship</option>
          <option value="trading-investing">Trading & Investing</option>
        </select>

        <div className="flex space-x-4 mt-8">
          {!isLoading ? (
            <div
              className="text-sm text-white bg-approve py-2 px-8 rounded-lg cursor-pointer"
              onClick={submitConsent}
            >
              Submit
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
        </div>
      </div>
    </div>
  );
}
