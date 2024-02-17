import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

console.log("🔥🔥", import.meta.env.VITE_CONVEX_URL);

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
