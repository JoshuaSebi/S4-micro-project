import type { Metadata } from "next"
import DashboardView from "@/components/dashboard-view"

export const metadata: Metadata = {
  title: "BeatSync - Dashboard",
  description: "Your personal music dashboard",
}

export default function DashboardPage() {
  return <DashboardView />
}

