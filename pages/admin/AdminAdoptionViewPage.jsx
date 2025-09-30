import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPaw,
  FaUser,
  FaClipboardList,
  FaNotesMedical,
} from "react-icons/fa";

export default function AdminAdoptionViewPage() {
  const { petId } = useParams();
  const [adoption, setAdoption] = useState(null);

  useEffect(() => {
    const fetchAdoption = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/adoptions/pet/${petId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdoption(res.data);
      } catch (err) {
        console.error("Error fetching adoption:", err);
      }
    };
    fetchAdoption();
  }, [petId]);

  if (!adoption) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaClipboardList className="bg-white/20 p-2 rounded-full" size={40} />
            Adoption Request Details
          </h1>
        </div>

        <div className="p-8 space-y-8">
          {/* Pet Image */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-lg border-4 border-purple-200">
              <img
                src={
                  adoption.petDetails?.images?.[0] ||
                  "https://via.placeholder.com/300"
                }
                alt={adoption.petDetails?.name || "Pet"}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          </div>

          {/* Pet Details */}
          <div className="bg-purple-50 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
              <FaPaw className="bg-purple-200 p-2 rounded-full text-purple-700" size={36} />
              Pet Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p><strong>ID:</strong> {adoption.petDetails?.petId}</p>
              <p><strong>Name:</strong> {adoption.petDetails?.name}</p>
              <p><strong>Species:</strong> {adoption.petDetails?.species}</p>
              <p><strong>Breed:</strong> {adoption.petDetails?.breed}</p>
              <p><strong>Sex:</strong> {adoption.petDetails?.sex}</p>
              <p><strong>Age:</strong> {adoption.petDetails?.ageYears} years</p>
              <p><strong>Size:</strong> {adoption.petDetails?.size}</p>
              <p><strong>Color:</strong> {adoption.petDetails?.color}</p>
            </div>
            <p className="mt-4 text-gray-800">
              <strong>Description:</strong>{" "}
              {adoption.petDetails?.description || "No description available"}
            </p>
            <p className="mt-2 text-gray-800 flex items-center gap-2">
              <FaNotesMedical className="text-purple-600" /> 
              <strong>Health Records:</strong>{" "}
              {adoption.petDetails?.healthRecords?.length > 0
                ? adoption.petDetails.healthRecords.map((r) => r.type).join(", ")
                : "N/A"}
            </p>
          </div>

          {/* User Details */}
          <div className="bg-blue-50 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <FaUser className="bg-blue-200 p-2 rounded-full text-blue-700" size={36} />
              Applicant Details
            </h2>
            <p><strong>Name:</strong> {adoption.personalInfo?.fullName}</p>
            <p><strong>Phone:</strong> {adoption.personalInfo?.phone}</p>
            <p><strong>Address:</strong> {adoption.personalInfo?.address}</p>
            <p><strong>Age:</strong> {adoption.personalInfo?.age || "N/A"}</p>
            <p><strong>Alternate Email:</strong> {adoption.alternateEmail || "N/A"}</p>
          </div>

          {/* Adoption Info */}
          <div className="bg-green-50 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
              <FaClipboardList className="bg-green-200 p-2 rounded-full text-green-700" size={36} />
              Adoption Info
            </h2>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    adoption.adoptionStatus === "Approved"
                      ? "bg-green-200 text-green-800"
                      : adoption.adoptionStatus === "Rejected"
                      ? "bg-red-200 text-red-800"
                      : adoption.adoptionStatus === "Completed"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-yellow-200 text-yellow-800" // Pending or fallback
                  }`}
              >
                {adoption.adoptionStatus}
              </span>
            </p>

            {/* Rejection reason */}
            {adoption.adoptionStatus === "Rejected" && (
              <p className="mt-2 text-red-600">
                <strong>Rejection Reason:</strong> {adoption.rejectionReason}
              </p>
            )}

            {/* Dates */}
            <p><strong>Applied Date:</strong> {new Date(adoption.createdAt).toLocaleDateString()}</p>
            {adoption.adoptionStatus === "Completed" && (
              <p><strong>Adopted Date:</strong> {adoption.adoptionDate
                ? new Date(adoption.adoptionDate).toLocaleDateString()
                : "N/A"}</p>
            )}

            <p><strong>Home Environment:</strong> {adoption.homeEnvironment}</p>
            <p><strong>Experience:</strong> {adoption.experience}</p>
          </div>

          {/* Go Back Button */}
          <div className="flex justify-center">
            <Link
              to="/admin/adoptions"
              className="px-8 py-3 border-2 border-purple-700 text-purple-700 font-semibold rounded-full hover:bg-purple-700 hover:text-white transition duration-300 shadow-md"
            >
              ← Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
