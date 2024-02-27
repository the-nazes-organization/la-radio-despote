'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { Track } from '@spotify/web-api-ts-sdk';
import { Search } from 'lucide-react';

interface RequestTrackFormProps {
	setResults: React.Dispatch<React.SetStateAction<Track[]>>;
}

const formSchema = z.object({
	trackQuery: z.string().min(1).max(50),
});

export const RequestTrackForm = ({ setResults }: RequestTrackFormProps) => {
	const player = useSpotifyPlayerStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			trackQuery: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const elementsFound = await player.sdk.search(
			values.trackQuery,
			['track'],
			undefined,
			10,
		);

		setResults(elementsFound.tracks.items);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex justify-between gap-2"
			>
				<FormField
					control={form.control}
					name="trackQuery"
					render={({ field }) => (
						<FormItem className="w-full">
							{/* <FormLabel>Username</FormLabel> */}
							<FormControl>
								<Input placeholder="Looking for a song..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" size={'icon'} className="w-auto px-2">
					<span className="hidden md:block md:w-full">Search</span>
					<Search />
				</Button>
			</form>
		</Form>
	);
};
