import React, { useState } from "react";
import { PowerOff, Power, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type School = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status?: string;
};

interface SchoolTableProps {
  schools: School[];
  setSchools: React.Dispatch<React.SetStateAction<School[]>>;
}

const SchoolTable: React.FC<SchoolTableProps> = ({ schools, setSchools }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [statusChangingId, setStatusChangingId] = useState<string | null>(null);

  const openDeleteModal = (school: School) => {
    setSelectedSchool(school);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedSchool(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!selectedSchool) return;
    setDeletingId(selectedSchool.id);
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/school/${selectedSchool.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setDeletingId(null);
    setShowModal(false);
    setSelectedSchool(null);
    if (res.ok) {
      // Remove from local state
      setSchools((prev) => prev.filter((s) => s.id !== selectedSchool.id));
    } else {
      alert("Failed to delete user");
    }
  };

  const handleStatusChange = async (school: School, newStatus: string) => {
    setStatusChangingId(school.id);
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/school/${school.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    setStatusChangingId(null);
    if (res.ok) {
      // Update status in local state
      setSchools((prev) =>
        prev.map((s) =>
          s.id === school.id ? { ...s, status: newStatus } : s
        )
      );
    } else {
      alert("Failed to update status");
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Date of Created</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {(schools ?? []).map((school) => (
            <tr key={school.id}>
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {school.name?.charAt(0).toUpperCase()}
                </div>
                <span>{school.name}</span>
              </td>
              <td className="px-6 py-4">{school.email}</td>
              <td className="px-6 py-4">
                {new Date(school.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                {school.status !== "deactivated" ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    Active
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                    Deactivate
                  </span>
                )}
              </td>
              <td className="px-6 py-4 flex items-center gap-2">
                {school.status !== "deactivated" ? (
                  <Button
                    className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded mr-2 flex items-center gap-1"
                    onClick={() => handleStatusChange(school, "deactivated")}
                    disabled={statusChangingId === school.id}
                  >
                    <PowerOff size={16} />
                    {statusChangingId === school.id && <span>...</span>}
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2 flex items-center gap-1"
                    onClick={() => handleStatusChange(school, "active")}
                    disabled={statusChangingId === school.id}
                  >
                    <Power size={16} />
                    {statusChangingId === school.id && <span>...</span>}
                  </Button>
                )}
                <Button
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded mr-2 flex items-center gap-1"
                  onClick={() => router.push(`/admin/edit/${school.id}`)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  className="bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1"
                  onClick={() => openDeleteModal(school)}
                  disabled={deletingId === school.id}
                >
                  <Trash size={16} />
                  {deletingId === school.id && <span>Deleting...</span>}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showModal && selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] flex flex-col items-center">
            <div className="font-bold text-lg mb-6 text-center">
              Are you sure you want to delete ?
            </div>
            <div className="flex gap-4 w-full justify-center">
              <Button
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold"
                onClick={closeDeleteModal}
                disabled={deletingId === selectedSchool.id}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 text-white px-6 py-2 rounded font-bold"
                onClick={handleDelete}
                disabled={deletingId === selectedSchool.id}
              >
                Delete
                {deletingId === selectedSchool.id && <span>...</span>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SchoolTable);