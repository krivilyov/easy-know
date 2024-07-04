"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { FaTools } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";

interface SpaceData {
	id: number;
	slug: string;
	name: string;
	description: string;
	createdAt?: Date;
	updatedAt?: Date;
	banned?: boolean;
	users: { user: { id: number; email: string }; role: "ADMIN" | "CUSTOMER" }[];
}

export default function SpaceDetail({ space }: { space: SpaceData }) {
	const [users, setUsers] = useState<
		{ user: { id: number; email: string }; role: "ADMIN" | "CUSTOMER" }[]
	>(space.users);

	console.log(space);

	return (
		<div className="text-base">
			<h1 className="text-2xl font-semibold">{space.name}</h1>
			<div className="mb-8">{space.description}</div>
			<div className="grid grid-cols-3 gap-4">
				<div>
					<Card>
						<CardHeader className="bg-muted/50">
							<CardTitle>Инфо</CardTitle>
						</CardHeader>
						<CardContent className="p-6 text-sm">
							<div className="grid gap-3">
								<ul className="grid gap-3">
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Дата создания:
										</span>
										<span>{dayjs(space.createdAt).format("DD-MM-YYYY")}</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Количество статей:
										</span>
										<span>100</span>
									</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>

				<Card className="col-span-2">
					<CardHeader className="p-4 bg-muted/50">
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div>Пользователи</div>
								<Badge variant="secondary">{users.length}</Badge>
							</div>
							<Button size="sm" variant={"outline"}>
								Добавить
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6 text-sm">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">id</TableHead>
									<TableHead>Email</TableHead>
									<TableHead className="w-[200px]">Role</TableHead>
									<TableHead className="w-[100px] text-center">
										<div className="flex items-center justify-center">
											<FaTools className="w-4 h-4" />
										</div>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.length > 0 &&
									users.map(({ user, role }) => (
										<TableRow key={user.id}>
											<TableCell>{user.id}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>
												<Badge variant="secondary">{role}</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center justify-center">
													<MdDelete
														className="w-5 h-5 cursor-pointer"
														onClick={() => console.log(user.id)}
													/>
												</div>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
