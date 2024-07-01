"use client";

import { getSpaceByUser } from "@/actions/space";
import { SpaceData } from "@/helpers/models";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {
	const [space, setSpace] = useState<SpaceData | null>(null);

	const getSpace = async () => {
		const data = new FormData();
		data.append("slug", params.slug);
		const space = await getSpaceByUser(data);

		if (space) {
			setSpace(space);
		}
	};

	useEffect(() => {
		getSpace();
	}, [params]);

	return (
		<div className="container mx-auto w-full h-full flex flex-col flex-grow py-8">
			{space && <div>Space name {space.name}</div>}
		</div>
	);
}
