import { NextResponse } from "next/server";
import axios from "axios";
import { BACKEND_URL } from "@/app/constants";

// To handle a POST request to /api
export async function POST(request: Request) {
  let body = JSON.stringify({
    insight_type: "top_debit",
    month: 6,
  });
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${BACKEND_URL}/api/v1/get-insights`,
    headers: {},
    data: body,
  };

  let response = await axios.request(config);
  let data = await response.data;

  return NextResponse.json({ data: data }, { status: 200 });
}
