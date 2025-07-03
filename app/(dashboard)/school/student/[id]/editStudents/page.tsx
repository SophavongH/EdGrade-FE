'use client'
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateStudent, fetchStudent } from "@/lib/api"; // You need to implement fetchStudent if not present
import Image from "next/image";

export default function EditStudentPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    name: "",
    avatar: "",
    gender: "",
    parentPhone: "",
    dob: "",
    address: "",
    phone: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch student data by id
    const loadStudent = async () => {
      const student = await fetchStudent(id);
      setForm(student);
      setImage(student.avatar || null);
    };
    loadStudent();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStudent(id, {
        ...form,
        avatar: image,
        gender: form.gender === "male" ? "Male" : "Female",
      });
      router.push("/school/student");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col">
      <Button
        asChild
        className="mb-10 w-fit border bg-white text-xs text-dark-200 hover:bg-light-300"
      >
        <span onClick={() => router.push("/school/student")}>
          <Image src="/icons/undo-arrow.svg" alt="Back" width={20} height={20} />
          Go back
        </span>
      </Button>
      <form className="w-full max-w-2xl space-y-4" onSubmit={handleSubmit}>
        {/* Avatar upload */}
        <div
          className="w-36 h-36 rounded-full bg-orange-200 flex items-center justify-center cursor-pointer mb-6 overflow-hidden"
          onClick={() => document.getElementById("avatarInput")?.click()}
        >
            {image ? (
            <Image
              src={image}
              alt="Profile"
              className="w-full h-full object-cover"
              width={144}
              height={144}
              unoptimized
            />
            ) : (
            <span className="text-6xl text-white">+</span>
            )}
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        {/* Form fields */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded border px-4 py-2"
          placeholder="Name"
          required
        />
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="w-full rounded border px-4 py-2"
          placeholder="Date of Birth"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full rounded border px-4 py-2"
          required
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full rounded border px-4 py-2"
          placeholder="Adress"
        />
        <input
          name="parentPhone"
          value={form.parentPhone}
          onChange={handleChange}
          className="w-full rounded border px-4 py-2"
          placeholder="Parent's Phone Number"
          required
        />
        <Button
          type="submit"
          className="w-full bg-[#25388C] hover:bg-[#1e2e6d] text-white text-lg"
          disabled={loading}
        >
          {loading ? "Editing..." : "Edit"}
        </Button>
      </form>
    </section>
  );
}