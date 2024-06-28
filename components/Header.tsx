import { getSession } from "@/actions/auth";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import UserMenu from "@/components/user-auth-menu/UserAuthMenu";

export default function Header() {
	return (
		<nav className="box-border flex border-b border-border h-[60px] py-2">
			<div className="container md:mx-auto flex justify-between items-center">
				<Logo />
				<div className="flex items-center gap-6">
					<ThemeSwitcher />
					<UserMenu />
				</div>
			</div>
		</nav>
	);
}
