import type { NextRequest } from "next/server";
import { updateSession } from "@/actions/auth";

export async function middleware(request: NextRequest) {
	console.log("inside middleware");
	return await updateSession(request);
}
