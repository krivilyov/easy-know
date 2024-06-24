import { z } from "zod";

export const registrationFormSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.email({ message: "Вы ввели некорректный email" }),
});

export type registrationFormSchemaType = z.infer<typeof registrationFormSchema>;

export const loginFormEmailSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.email({ message: "Вы ввели некорректный email" }),
});

export type loginFormEmailSchemaType = z.infer<typeof loginFormEmailSchema>;

export const loginFormPinSchema = z.object({
	pin: z.string().min(1, { message: "Поле не может быть пустым" }),
});

export type loginFormPinSchemaType = z.infer<typeof loginFormPinSchema>;

export const loginFormSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.email({ message: "Вы ввели некорректный email" }),
	pin: z.string().min(1, { message: "Поле не может быть пустым" }),
});

export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
