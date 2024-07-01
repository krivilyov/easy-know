import { z } from "zod";

export const createSpaceSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Поле не может быть пустым" })
		.max(35, { message: "Максимальная длина поля 35 символов" }),
	description: z.string(),
});

export type createSpaceSchemaType = z.infer<typeof createSpaceSchema>;
