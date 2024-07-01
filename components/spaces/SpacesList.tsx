"use client";

import { deleteSpaceById, getUserSpaces } from "@/actions/space";
import CreateSpaceBtn from "@/components/spaces/CreateSpaceBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpaceData } from "@/helpers/models";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function SpacesList() {
	const [spaces, setSpaces] = useState<SpaceData[]>([]);
	const [isShowConfirmDeleteDialog, setIsShowConfirmDeleteDialog] =
		useState(false);
	const [delitingSpace, setDelitingSpace] = useState<SpaceData | null>(null);

	const getSpaces = async () => {
		const spaces = await getUserSpaces();
		setSpaces(spaces);
	};

	useEffect(() => {
		getSpaces();
	}, []);

	useEffect(() => {
		if (delitingSpace) {
			setIsShowConfirmDeleteDialog(true);
		}
	}, [delitingSpace]);

	const handleDeleteSpace = async () => {
		if (delitingSpace) {
			const data = new FormData();
			data.append("id", delitingSpace.id.toString());
			const delitedSpace = await deleteSpaceById(data);

			if (delitedSpace) {
				const formattedSpaces = spaces.filter(
					(space) => space.id !== delitedSpace.id
				);
				setSpaces(formattedSpaces);
				setDelitingSpace(null);
				setIsShowConfirmDeleteDialog(false);
			}
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
			<CreateSpaceBtn />
			{spaces.length > 0 &&
				spaces.map((space) => (
					<Link key={space.id} href={`/spaces/${space.slug}`}>
						<Card className="min-h-[190px] hover:border-primary">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 justify-between">
									<span className="truncate font-bold max-w-[70%]">
										{space.name}
									</span>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="icon"
											onClick={(e) => {
												e.preventDefault();
												setDelitingSpace(space);
											}}
										>
											<FaTrash className="h-4 w-4" />
										</Button>
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent className="truncate text-sm text-muted-foreground"></CardContent>
						</Card>
					</Link>
				))}

			<Dialog
				open={isShowConfirmDeleteDialog}
				onOpenChange={() => {
					setIsShowConfirmDeleteDialog(false);
					setDelitingSpace(null);
				}}
			>
				<DialogContent className="space-y-4">
					<DialogHeader>
						<DialogTitle>Пространство {delitingSpace?.name}</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите безвозвратно удалить пространство и всю
							информацию, располагаемую в нём?
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center justify-between w-[50%] m-auto">
						<Button variant={"outline"} onClick={handleDeleteSpace}>
							Да
						</Button>
						<Button
							onClick={() => {
								setDelitingSpace(null);
								setIsShowConfirmDeleteDialog(false);
							}}
						>
							Нет
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
