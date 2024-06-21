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
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { Input } from "@/components/ui/input";
import { ImSpinner2 } from "react-icons/im";
import { loginFormSchema, loginFormSchemaType } from "@/schemas/auth";

export default function LoginForm() {
	const [isPending, startTransition] = useTransition();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<loginFormSchemaType>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onFormSubmit = (values: loginFormSchemaType) => {
		console.log(values);
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
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="Пароль"
												disabled={isPending}
												{...field}
											/>
											<Button
												variant={"ghost"}
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={(e) => {
													e.preventDefault();
													setShowPassword((prev) => !prev);
												}}
											>
												{showPassword ? <GoEye /> : <GoEyeClosed />}
											</Button>
										</div>
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
							{!isPending && <span>Войти</span>}
							{isPending && <ImSpinner2 className="animate-spin" />}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
