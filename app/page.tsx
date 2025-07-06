import { redirect } from "next/navigation";

const page = () => {
  redirect("/[locale]/login");
  return null;
}

export default page