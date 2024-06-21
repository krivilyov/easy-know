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

export const loginFormSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.email({ message: "Вы ввели некорректный email" }),
	password: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.min(6, { message: "Пароль не может быть короче 6 символов" }),
});

export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
