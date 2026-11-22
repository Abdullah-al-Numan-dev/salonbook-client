import Link from "next/link";
import ErrorView from "@/components/ui/ErrorView";
import { buttonStyles } from "@/components/ui/Button";

export default function DashboardNotFound() {
  return (
    <ErrorView
      code="404"
      title="Page not found"
      description="This dashboard page does not exist."
      actions={
        <Link href="/dashboard" className={buttonStyles()}>
          Back to my dashboard
        </Link>
      }
    />
  );
}