import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SchoolUserFormProps {
  initial?: { name: string; email: string };
  loading?: boolean;
  onSubmit: (data: { name: string; email: string; password?: string }) => void;
  isEdit?: boolean;
}

export default function SchoolUserForm({
  initial,
  loading,
  onSubmit,
  isEdit = false,
}: SchoolUserFormProps) {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    setName(initial?.name || "");
    setEmail(initial?.email || "");
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    if (isEdit && password) {
      if (password !== confirm) {
        alert("Passwords do not match");
        return;
      }
      onSubmit({ name, email, password });
    } else {
      onSubmit({ name, email });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block mb-1 font-medium">School&#39;s Name</label>
        <input
          className="w-full border rounded px-4 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter school's name"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          className="w-full border rounded px-4 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter email"
          required
          type="email"
        />
      </div>
      {!isEdit && (
        <>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              className="w-full border rounded px-4 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              type="password"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confrim Password</label>
            <input
              className="w-full border rounded px-4 py-2"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Enter confirm password"
              required
              type="password"
            />
          </div>
        </>
      )}
      {isEdit && (
        <>
          <div>
            <label className="block mb-1 font-medium">New Password (New Password)</label>
            <input
              className="w-full border rounded px-4 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password (leave blank to keep current)"
              type="password"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm New Password (Confirm New Password)</label>
            <input
              className="w-full border rounded px-4 py-2"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              type="password"
            />
          </div>
        </>
      )}
      <Button
        type="submit"
        className="w-full bg-[#25388C] hover:bg-[#1e2e6d] text-white"
        disabled={loading}
      >
        {loading ? (isEdit ? "Editting..." : "Creating...") : isEdit ? "Edit" : "Create"}
      </Button>
    </form>
  );
}