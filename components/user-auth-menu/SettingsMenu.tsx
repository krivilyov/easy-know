"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RxEnter } from "react-icons/rx";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { MdOutlineLibraryBooks } from "react-icons/md";

export default function SettingsMenu(session: any) {
	const router = useRouter();

	const handleLogout = async () => {
		await logout();
		router.push("/");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Меню</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-44" align="end">
				<DropdownMenuLabel className="max-w-48 truncate">
					{session.session.userData.email}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="cursor-pointer">
						<Link
							href="/spaces"
							className="w-full h-full flex items-center justify-between"
						>
							Пространства
							<DropdownMenuShortcut>
								<MdOutlineLibraryBooks className="w-4 h-4" />
							</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
						Выход
						<DropdownMenuShortcut>
							<RxEnter className="w-4 h-4" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
