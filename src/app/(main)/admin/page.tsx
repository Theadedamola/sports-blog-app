import { AdminClient } from "./AdminClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Monitor API status, prediction accuracy, and platform analytics.",
};

export default function AdminPage() {
  return <AdminClient />;
}
