import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInBtn() {
	return (
		<Button asChild>
			<Link href="/login">Войти</Link>
		</Button>
	);
}
