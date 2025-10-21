import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
  FaPaw,
  FaCalendarAlt,
  FaPalette,
  FaRulerVertical,
  FaVenusMars,
  FaInfoCircle,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";

import generateAdoptionCertificate from "../utils/generateAdoptionCertificate";

export default function AdoptionDetailsPage() {
  const { adoptionId } = useParams();
  const navigate = useNavigate();

  const [adoption, setAdoption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdoption = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/adoptions/${adoptionId}`
        );
        setAdoption(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load adoption request");
      } finally {
        setLoading(false);
      }
    };

    fetchAdoption();
  }, [adoptionId]);

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/adoptions/pet/${adoption.petId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Adoption request canceled");
      navigate("/adoptions");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to cancel adoption request"
      );
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!adoption)
    return <p className="text-center mt-10">Adoption request not found.</p>;

  const pet = adoption.petDetails;

  const status = adoption.adoptionStatus?.toUpperCase();

  const steps =
    status === "REJECTED"
      ? ["APPLIED", "PENDING", "REJECTED"]
      : ["APPLIED", "PENDING", "APPROVED", "COMPLETED"];

  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-white p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-purple-700 flex items-center gap-2">
          <FaPaw className="text-purple-600" />
          Adoption Request Details
        </h1>

        {/* Pet Info */}
        {pet && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 mb-6 flex flex-col items-center">
            <img
              src={Array.isArray(pet.images) ? pet.images[0] : pet.images}
              alt={pet.name}
              className="w-40 h-40 object-cover rounded-full border-4 border-purple-300 shadow-lg mb-4"
            />
            <h2 className="text-2xl font-semibold text-purple-800 mb-2">
              {pet.name}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p className="flex items-center gap-2">
                <FaInfoCircle className="text-purple-500" />
                Species: {pet.species}
              </p>
              <p className="flex items-center gap-2">
                <FaVenusMars className="text-purple-500" />
                Sex: {pet.sex}
              </p>
              <p className="flex items-center gap-2">
                <FaInfoCircle className="text-purple-500" />
                Breed: {pet.breed}
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-purple-500" />
                Age: {pet.ageYears} years
              </p>
              <p className="flex items-center gap-2">
                <FaRulerVertical className="text-purple-500" />
                Size: {pet.size}
              </p>
              <p className="flex items-center gap-2">
                <FaPalette className="text-purple-500" />
                Color: {pet.color}
              </p>
            </div>
            <p className="mt-4 text-gray-800 text-center">{pet.description}</p>
          </div>
        )}

        {/* Adoption Info */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-100 border border-purple-200 rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
            <FaInfoCircle className="text-purple-600" /> Adoption Info
          </h3>

          <p className="flex items-center gap-3 text-base">
            <strong className="text-gray-700">Status:</strong>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full shadow-sm flex items-center gap-2
        ${
          status === "PENDING"
            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
            : status === "APPROVED"
            ? "bg-green-100 text-green-700 border border-green-300"
            : status === "REJECTED"
            ? "bg-red-100 text-red-700 border border-red-300"
            : "bg-purple-100 text-purple-700 border border-purple-300"
        }`}
            >
              {status === "APPROVED" && <FaCheckCircle className="w-4 h-4" />}
              {status === "REJECTED" && <FaTimesCircle className="w-4 h-4" />}
              {status}
            </span>
          </p>

          {status === "REJECTED" && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                <FaTimesCircle className="w-4 h-4" />
                <strong>Rejection Reason:</strong>{" "}
                {adoption.rejectionReason || "Not specified"}
              </p>
            </div>
          )}
        </div>

        <div className="w-full mb-6 relative">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">
            Adoption Progress
          </h3>

          <div className="absolute left-22 right-22 top-15 -translate-y-1/2 h-1 bg-gray-300 z-0">
            <div
              className="h-1 bg-purple-700 transition-all duration-500"
              style={{
                width: `${
                  currentStepIndex >= 0
                    ? (currentStepIndex / (steps.length - 1)) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            {steps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center w-full">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
                      isActive ? "bg-purple-700" : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      isActive
                        ? "text-purple-700 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link
            to="/adoptions"
            className="px-8 py-3 border-2 border-purple-700 text-purple-700 font-semibold rounded-full hover:bg-purple-700 hover:text-white transition duration-300"
          >
            ← Go Back
          </Link>

          {status === "PENDING" && (
            <button
              onClick={handleCancel}
              className="px-8 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition duration-300 shadow-md flex items-center gap-2"
            >
              <FaTimesCircle /> Cancel Request
            </button>
          )}

          {status === "PENDING" && (
            <Link
              to={`/adopt/${adoption.petId}/edit`}
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition duration-300 shadow-md flex items-center gap-2"
            >
              ✏️ Edit Request
            </Link>
          )}

          {status === "COMPLETED" && (
            <button
              onClick={() => generateAdoptionCertificate(adoption)}
              className="px-8 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-full hover:bg-green-600 hover:text-white transition duration-300 shadow-md flex items-center gap-2"
            >
              📄 Download Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
