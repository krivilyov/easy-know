import { getSession } from "@/actions/auth";
import SignInBtn from "@/components/SignInBtn";
import SettingsMenu from "@/components/user-auth-menu/SettingsMenu";

export default async function UserAuthMenu() {
	const session = await getSession();

	return (
		<>
			{!session && <SignInBtn />}
			{session && <SettingsMenu session={session} />}
		</>
	);
}
