import { redirect } from "next/navigation";

export default function StudentsRedirectPage() {
  redirect("/participant/dashboard");
}
