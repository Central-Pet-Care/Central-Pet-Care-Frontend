import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft, FaTrash, FaPlus } from "react-icons/fa";

export default function HealthRecordsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pet = location.state?.pet;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newRecord, setNewRecord] = useState({
    visitDate: "",
    vetName: "",
    type: "Checkup",
    notes: "",
  });

  useEffect(() => {
    if (!pet) {
      toast.error("No pet selected");
      navigate("/admin/pets");
      return;
    }
    setRecords(pet.healthRecords || []);
  }, [pet, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleAddRecord = async () => {
    // ✅ Validation
    if (!newRecord.visitDate || !newRecord.vetName) {
      toast.error("Please fill visit date and vet name");
      return;
    }

    // ✅ Future date validation
    const today = new Date();
    const selectedDate = new Date(newRecord.visitDate);
    if (selectedDate > today) {
      toast.error("Visit date cannot be in the future");
      return;
    }

    // ✅ Vet name validation (only letters & spaces)
    if (!/^[A-Za-z\s]+$/.test(newRecord.vetName)) {
      toast.error("Vet name can only contain letters");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const updatedPet = await axios.patch(
        `http://localhost:5000/api/pets/${pet.petId}/healthRecords`,
        { record: newRecord },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(updatedPet.data.healthRecords);
      setNewRecord({ visitDate: "", vetName: "", type: "Checkup", notes: "" });
      toast.success("Health record added");
    } catch (err) {
      console.error("Add failed:", err.response || err.message);
      toast.error("Failed to add record");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (index) => {
    if (!window.confirm("Delete this health record?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const updatedPet = await axios.delete(
        `http://localhost:5000/api/pets/${pet.petId}/healthRecords/${index}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(updatedPet.data.healthRecords);
      toast.success("🗑️ Record deleted");
    } catch (err) {
      console.error("❌ Delete failed:", err.response || err.message);
      toast.error("Failed to delete record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-start py-10">
      <div className="w-full max-w-4xl bg-gradient-to-br from-purple-100 via-white to-indigo-200 rounded-2xl shadow-md p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          🩺 Manage Health Records - {pet?.name}
        </h1>

        {/* Add Record Form */}
        <section className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Add New Record
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="visitDate"
              value={newRecord.visitDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]} // 🔥 Prevents selecting future date
              className="border p-3 rounded-xl shadow-sm w-full focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              name="vetName"
              placeholder="Vet Name"
              value={newRecord.vetName}
              onChange={handleChange}
              className="border p-3 rounded-xl shadow-sm w-full focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <select
              name="type"
              value={newRecord.type}
              onChange={handleChange}
              className="border p-3 rounded-xl shadow-sm w-full focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Checkup">Checkup</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Surgery">Surgery</option>
              <option value="Medication">Medication</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              name="notes"
              placeholder="Notes"
              value={newRecord.notes}
              onChange={handleChange}
              rows="3"
              className="border p-3 rounded-xl shadow-sm w-full focus:ring-2 focus:ring-indigo-400"
            ></textarea>
          </div>

          <button
            onClick={handleAddRecord}
            disabled={loading}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-medium transition shadow-md disabled:opacity-50"
          >
            {loading ? "Adding..." : <><FaPlus className="inline mr-2" /> Add Record</>}
          </button>
        </section>

        {/* Records List */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Existing Records
          </h2>
          {records.length === 0 ? (
            <p className="text-gray-500 text-center">No health records yet</p>
          ) : (
            <ul className="space-y-3">
              {records.map((record, i) => (
                <li
                  key={i}
                  className="border p-4 rounded-xl bg-gray-50 flex justify-between items-start shadow-sm"
                >
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Date:</strong>{" "}
                      {new Date(record.visitDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Vet:</strong> {record.vetName}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Type:</strong> {record.type}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Notes:</strong> {record.notes || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRecord(i)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete record"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
