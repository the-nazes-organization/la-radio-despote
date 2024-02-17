import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader(opts) {
    return { w: "qwe" };
  },
  component: Index,
});

function Index() {
  const data = Route.useLoaderData();

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
