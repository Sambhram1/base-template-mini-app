"use client";

import dynamic from "next/dynamic";
import { APP_NAME } from "~/lib/constants";

// note: dynamic import is required for components that use the Frame SDK
const LuxLinkDemo = dynamic(() => import("~/components/LuxLinkDemo"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: APP_NAME }
) {
  return <LuxLinkDemo title={title} />;
}
