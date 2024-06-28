import type { NextRequest } from "next/server";
import { updateSession } from "@/actions/auth";

export async function middleware(request: NextRequest) {
	const { nextUrl } = request;
	const session = await updateSession(request);
	const authRoutes = ["/login", "/registration"];

	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isAuthRoute) {
		if (session) {
			return Response.redirect(new URL("/", nextUrl));
		}
		return;
	}

	if (!session) {
		return Response.redirect(new URL("/login", nextUrl));
	}

	return;
}

export const config = {
	matcher: ["/login", "/registration", "/spaces", "/spaces/:path*"],
};
