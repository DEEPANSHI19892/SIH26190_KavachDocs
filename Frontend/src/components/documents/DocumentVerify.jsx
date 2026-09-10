import { useState } from "react";
import {
  FiCheckCircle,
  FiRefreshCw,
  FiShield,
  FiXCircle,
} from "react-icons/fi";

import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";

const DocumentVerify = ({ documentId }) => {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyDocument = async () => {
    if (!documentId) {
      setError("Document ID is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        ENDPOINTS.DOCUMENTS.VERIFY(documentId)
      );

      setVerification(response.data);

    } catch (error) {
      console.error(
        "Document verification failed:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Document verification failed."
      );

    } finally {
      setLoading(false);
    }
  };

  const isVerified =
    verification?.verified === true ||
    verification?.status === "VERIFIED";

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      {/* Header */}
      <div className="border-b border-slate-200 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <FiShield
              className="text-slate-700"
              size={21}
            />
          </div>

          <div>

            <h2 className="font-semibold text-slate-900">
              Document Integrity
            </h2>

            <p className="text-sm text-slate-500">
              Verify document integrity using its cryptographic hash.
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-5 p-5">

        {/* Error */}
        {error && (

          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>

        )}

        {/* Hash */}
        {verification?.hash && (

          <div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              SHA-256 Hash
            </p>

            <div className="break-all rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
              {verification.hash}
            </div>

          </div>

        )}

        {/* Verification Status */}
        {verification && (

          <div
            className={`rounded-xl border p-5 ${
              isVerified
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >

            <div className="flex items-center gap-3">

              {isVerified ? (

                <FiCheckCircle
                  className="text-green-600"
                  size={26}
                />

              ) : (

                <FiXCircle
                  className="text-red-600"
                  size={26}
                />

              )}

              <div>

                <p
                  className={`font-semibold ${
                    isVerified
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {isVerified
                    ? "Document Verified"
                    : "Verification Failed"}
                </p>

                <p
                  className={`text-sm ${
                    isVerified
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {isVerified
                    ? "The document integrity check passed successfully."
                    : "The document hash does not match the expected value."}
                </p>

              </div>

            </div>

          </div>

        )}

        {/* Initial state */}
        {!verification && !error && (

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">

            <FiShield
              className="mx-auto mb-3 text-slate-400"
              size={34}
            />

            <p className="font-medium text-slate-700">
              Document verification
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Verify that the document has not been modified.
            </p>

          </div>

        )}

        {/* Verify button */}
        <div className="flex justify-end">

          <button
            type="button"
            onClick={verifyDocument}
            disabled={loading || !documentId}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
            />

            {loading
              ? "Verifying..."
              : verification
              ? "Verify Again"
              : "Verify Document"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default DocumentVerify;