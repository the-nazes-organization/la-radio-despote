import { TypographyH1 } from '@/components/typography';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/')({
	component: Home,
});

function Home() {
	return (
		<div className="p-8">
			<TypographyH1>Home</TypographyH1>
		</div>
	);
}
