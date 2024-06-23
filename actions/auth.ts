"use server";

import { loginFormEmailSchema, registrationFormSchema } from "@/schemas/auth";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const secretKey = process.env.JWT_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("10 sec from now")
		.sign(key);
}

export async function decrypt(input: string): Promise<any> {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ["HS256"],
	});
	return payload;
}

export async function getSession() {
	const session = cookies().get("session")?.value;
	if (!session) return null;
	return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
	const session = request.cookies.get("session")?.value;
	console.log("session", session);
	if (!session) return;

	// Refresh the session so it doesn't expire
	const parsed = await decrypt(session);
	parsed.expires = new Date(Date.now() + 10 * 1000);
	const res = NextResponse.next();
	res.cookies.set({
		name: "session",
		value: await encrypt(parsed),
		httpOnly: true,
		expires: parsed.expires,
	});
	return res;
}

export async function registration(formData: FormData) {
	const data = Object.fromEntries(formData);
	const validatedFields = registrationFormSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: validatedFields.error.formErrors.fieldErrors };
	}

	const { email } = data;

	const existingUser = await prisma.users.findUnique({
		where: {
			email: email as string,
		},
	});

	if (existingUser) {
		return {
			error: {
				email: ["Пользователь с таким email уже зарегистрирован"],
			},
		};
	}

	const user = await prisma.users.create({
		data: {
			email: email as string,
		},
	});

	return user;
}

export async function setPin(formData: FormData) {
	const data = Object.fromEntries(formData);
	const validatedFields = loginFormEmailSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: validatedFields.error.formErrors.fieldErrors };
	}

	const user = await prisma.users.findUnique({
		where: {
			email: data.email as string,
		},
	});

	if (!user) {
		return {
			error: {
				email: ["Пользователь с таким email не существует"],
			},
		};
	}

	const randPin = Math.floor(1000 + Math.random() * 9000);
	const hashPin = await bcrypt.hash(randPin.toString(), 6);

	const updatedUser = await prisma.users.update({
		where: {
			id: user.id,
		},
		data: {
			hashPin: hashPin,
		},
	});

	if (updatedUser) {
		console.log("updatedUser", updatedUser);
		const resend = new Resend(process.env.RESEND_API_KEY);
		console.log("RESEND_API_KEY", process.env.RESEND_API_KEY);
		const { data, error } = await resend.emails.send({
			from: "Krivilyov Ivan <contact@eimaam.dev>",
			to: user.email,
			subject: "PIN для входа в приложение",
			html: `<div>Ваш PIN для входа в приложение: <span style="font-waight:bold">${randPin}</span></div>`,
		});

		console.log("data", data, "error", error);

		if (error) {
			return {
				error: true,
				success: false,
			};
		}

		return {
			error: null,
			success: true,
		};
	}

	throw new Error("something went wrong");
}

// export async function login(formData: FormData) {
// 	const data = Object.fromEntries(formData);
// 	const validatedFields = loginFormSchema.safeParse(data);

// 	if (!validatedFields.success) {
// 		return { error: validatedFields.error.formErrors.fieldErrors };
// 	}

// 	const user = await prisma.users.findUnique({
// 		where: {
// 			email: data.email as string,
// 		},
// 	});

// 	if (!user) {
// 		return {
// 			error: {
// 				email: ["Пользователь с таким email не существует"],
// 			},
// 		};
// 	}

// 	const passwordEquals = await bcrypt.compare(
// 		data.password as string,
// 		user.password as string
// 	);

// 	if (passwordEquals) {
// 		const userData = {
// 			email: user.email,
// 			role: user.role,
// 		};

// 		// Create the session
// 		const expires = new Date(Date.now() + 10 * 1000);
// 		const session = await encrypt({ user, expires });

// 		// Save the session in a cookie
// 		cookies().set("session", session, { expires, httpOnly: true });
// 	}

// 	return {
// 		error: {
// 			password: ["Вы ввели неверные данные"],
// 		},
// 	};
// }
