import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/')({
	component: Hello,
});

function Hello() {
	return <div className="p-2">Hello from Hello!</div>;
}
