import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSpaceSchema, createSpaceSchemaType } from "@/schemas/space";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { createSpace } from "@/actions/space";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

export default function CreateSpaceBtn() {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<createSpaceSchemaType>({
		resolver: zodResolver(createSpaceSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const onCreateSpaceFormSubmit = async (values: createSpaceSchemaType) => {
		setIsLoading(false);

		const data = new FormData();
		data.append("name", values.name);
		data.append("description", values.description);

		const space = await createSpace(data);
		const spaceErrors = space.errors;
		if (spaceErrors) {
			if (spaceErrors.name && spaceErrors.name.length > 0) {
				let errors = "";
				spaceErrors.name.forEach((error: string) => {
					errors += error + ". ";
				});

				form.setError("name", { type: "server", message: errors });
			}

			if (spaceErrors.description && spaceErrors.description.length > 0) {
				let errors = "";
				spaceErrors.description.forEach((error: string) => {
					errors += error + ". ";
				});

				form.setError("description", { type: "server", message: errors });
			}
		}

		if (!space.data) {
			toast({
				variant: "destructive",
				title: "Ошибка",
				description: "Что-то пошло не так",
			});
		}

		if (space.data) {
			router.push(`/spaces/${space.data.slug}`);
		}
	};

	return (
		<Dialog
			onOpenChange={() => {
				form.reset();
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
				>
					<MdOutlineLibraryAdd className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
					<p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
						Создать новое пространство
					</p>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Новое пространство</DialogTitle>
					<DialogDescription>
						Создайте новое пространство для работы командой
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onCreateSpaceFormSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Наименование</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Описание</FormLabel>
									<FormControl>
										<AutosizeTextarea maxHeight={200} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							onClick={form.handleSubmit(onCreateSpaceFormSubmit)}
							disabled={isLoading}
							className="w-full"
						>
							{!isLoading && <span>Создать</span>}
							{isLoading && <ImSpinner2 className="animate-spin" />}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
