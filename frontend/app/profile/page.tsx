import type { Metadata } from "next"
import ProfileView from "@/components/profile-view"

export const metadata: Metadata = {
  title: "Your Profile - BeatSync",
  description: "Manage your BeatSync profile",
}

export default function ProfilePage() {
  return <ProfileView />
}

