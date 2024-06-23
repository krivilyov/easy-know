"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	registrationFormSchema,
	registrationFormSchemaType,
} from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImSpinner2 } from "react-icons/im";
import { registration } from "@/actions/auth";
import { UserData, UserDataError } from "@/helpers/models";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegistrationForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<registrationFormSchemaType>({
		resolver: zodResolver(registrationFormSchema),
		defaultValues: {
			email: "",
		},
	});

	const onFormSubmit = async (values: registrationFormSchemaType) => {
		setIsLoading(true);
		const data = new FormData();
		data.append("email", values.email);

		const user: UserData | UserDataError = await registration(data);
		setIsLoading(false);
		//если вернулись ошибки
		if (user.error) {
			if (user.error.email && user.error.email.length > 0) {
				let errors = "";
				user.error.email.forEach((error: string) => {
					errors += error + ". ";
				});

				form.setError("email", { type: "server", message: errors });
			}
		}

		if ((user as UserData).id) {
			localStorage.setItem("userEmail", (user as UserData).email);
			router.push("/login");
		}
	};

	return (
		<div className="w-full 2sm:w-[350px] space-y-4">
			<h1 className="text-2xl font-bold text-center">Регистрация</h1>
			<div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onFormSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Email"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							onClick={form.handleSubmit(onFormSubmit)}
							disabled={form.formState.isSubmitting}
							className="w-full mt-4"
						>
							{!isLoading && <span>Зарегистрироваться</span>}
							{isLoading && <ImSpinner2 className="animate-spin" />}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
