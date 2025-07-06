import { redirect } from "next/navigation";

export default function Page({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/login`);
  // No need to return anything
}