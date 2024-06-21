import AuthHeader from "@/components/auth/AuthHeader";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
			<AuthHeader />
			{children}
		</main>
	);
}
