import { getSession } from "@/actions/auth";

export default async function Home() {
	const session = await getSession();

	return (
		<>
			<pre>{JSON.stringify(session, null, 2)}</pre>
		</>
	);
}
