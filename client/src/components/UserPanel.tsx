import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function UserPanel() {
  const [user, setUser] = useState < null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const me = await api("/auth/me");
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <p className="text-gray-400 text-sm">Loading user...</p>;
  if (!user) return <p className="text-gray-400 text-sm">No user info</p>;

  return (
    <div className="bg-[#05080E] rounded-xl p-4 shadow-md mb-4">
      <p className="text-gray-400 text-x">
        <span className="text-white">Name:</span> {user.first_name}{" "}
        {user.last_name}
      </p>

      <p className="text-gray-400 text-x">
        <span className="text-white">Email:</span> {user.email}
      </p>
    </div>
  );
}
