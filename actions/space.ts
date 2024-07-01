"use server";

import { createSpaceSchema } from "@/schemas/space";
import { getSession } from "@/actions/auth";
import prisma from "@/lib/prisma";
import transliterate from "@/helpers/transliteration";

class UserNotFoundErr extends Error {}

export async function createSpace(formData: FormData) {
	const data = Object.fromEntries(formData);
	const session = await getSession();

	if (!session) {
		throw new UserNotFoundErr();
	}

	const validatedFields = createSpaceSchema.safeParse(data);

	if (!validatedFields.success) {
		return { errors: validatedFields.error.formErrors.fieldErrors };
	}

	const space = await prisma.spaces.create({
		data: {
			name: data.name as string,
			slug: transliterate((data.name as string).toLowerCase()),
			description: data.description as string,
			users: {
				create: [
					{
						user: {
							connect: {
								id: session.userData.id,
							},
						},
						role: "ADMIN",
					},
				],
			},
		},
		include: {
			users: true,
		},
	});

	//апдейтим slug
	if (space) {
		const updatedSpace = await prisma.spaces.update({
			where: {
				id: space.id,
			},
			data: {
				slug: `${space.id}-${space.slug}`,
			},
		});

		return {
			data: updatedSpace,
		};
	}

	return {
		data: null,
	};
}

export async function getUserSpaces() {
	const session = await getSession();

	if (!session) {
		throw new UserNotFoundErr();
	}

	const spaces = await prisma.spaces.findMany({
		where: {
			users: {
				some: {
					user: {
						id: session.userData.id,
					},
				},
			},
		},
	});

	return spaces;
}

export async function deleteSpaceById(formData: FormData) {
	const session = await getSession();

	if (!session) {
		throw new UserNotFoundErr();
	}

	const data = Object.fromEntries(formData);

	const deletedSpace = await prisma.spaces.delete({
		where: {
			id: +data.id,
		},
	});

	return deletedSpace;
}

export async function getSpaceByUser(formData: FormData) {
	const session = await getSession();

	if (!session) {
		throw new Error("Unauthorized");
	}

	const data = Object.fromEntries(formData);

	const space = await prisma.spaces.findUnique({
		where: {
			slug: data.slug as string,
			users: {
				some: {
					user: {
						id: session.userData.id,
					},
				},
			},
		},
	});

	if (!space) {
		throw new Error("Access denied.");
	}

	return space;
}
