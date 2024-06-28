"use client";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SignInBtn from "@/components/SignInBtn";

export default function AuthHeader() {
	const pathname = usePathname();

	return (
		<div>
			<div className="container m-auto flex items-center justify-between h-[60px]">
				<Logo />
				<div className="flex items-center gap-6">
					<ThemeSwitcher />
					{pathname === "/login" ? (
						<Button asChild>
							<Link href="/registration">Регистрация</Link>
						</Button>
					) : (
						<SignInBtn />
					)}
				</div>
			</div>
		</div>
	);
}
