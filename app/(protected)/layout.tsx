import React, { ReactNode } from "react";
import Header from "@/components/Header";

function Layout({ children }: { children: ReactNode }) {
	return (
		<main className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
			<Header />
			{children}
		</main>
	);
}

export default Layout;
