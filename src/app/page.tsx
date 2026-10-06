import { redirect } from "next/navigation";

// One real page for now; the root goes straight to it.
export default function HomePage() {
  redirect("/delivery-agents/list");
}
