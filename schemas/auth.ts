import { z } from "zod";

export const registrationFormSchema = z
	.object({
		email: z
			.string()
			.min(1, { message: "Поле не может быть пустым" })
			.email({ message: "Вы ввели некорректный email" }),
		password: z
			.string()
			.min(1, { message: "Поле не может быть пустым" })
			.min(6, { message: "Пароль не может быть короче 6 символов" }),
		confirmPassword: z
			.string()
			.min(1, { message: "Поле не может быть пустым" })
			.min(6, { message: "Пароль не может быть короче 6 символов" }),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: "custom",
				message: "Подтверждение пароля не совпадает",
				path: ["confirmPassword"],
			});
		}
	});

export type registrationFormSchemaType = z.infer<typeof registrationFormSchema>;

export const loginFormOnlyEmailSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.email({ message: "Вы ввели некорректный email" }),
});

export type loginFormOnlyEmailSchemaType = z.infer<
	typeof loginFormOnlyEmailSchema
>;

export const loginFormWithPinSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.email({ message: "Вы ввели некорректный email" }),
	pin: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.min(4, { message: "Пароль не может быть короче 4 символов" }),
});

export type loginFormWithPinSchemaType = z.infer<typeof loginFormWithPinSchema>;

export const loginFormWithPasswordSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.email({ message: "Вы ввели некорректный email" }),
	password: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.min(4, { message: "Пароль не может быть короче 4 символов" }),
});

export type loginFormWithPasswordSchemaType = z.infer<
	typeof loginFormWithPasswordSchema
>;
