import { getSpaceByUser } from "@/actions/space";
import { notFound } from "next/navigation";
import SpaceDetail from "@/components/spaces/SpaceDetail";

interface SpaceData {
	id: number;
	slug: string;
	name: string;
	description: string;
	createdAt?: Date;
	updatedAt?: Date;
	banned?: boolean;
	users: { user: { id: number; email: string } }[];
}

export default async function Page({ params }: { params: { slug: string } }) {
	const data = new FormData();
	data.append("slug", params.slug);
	const space: SpaceData | null = await getSpaceByUser(data);

	if (!space) {
		notFound();
	}

	return (
		<div className="container mx-auto w-full h-full flex flex-col flex-grow py-8">
			<SpaceDetail space={space} />
		</div>
	);
}
