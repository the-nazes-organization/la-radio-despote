import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import ConvexClientProvider from "../lib/providers/ConvexProvider";

export const Route = createRootRoute({
	component: () => (
		<ConvexClientProvider>
			<div className="p-2 flex gap-2">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>{" "}
				<Link to="/about" className="[&.active]:font-bold">
					About
				</Link>
			</div>
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</ConvexClientProvider>
	),
});
