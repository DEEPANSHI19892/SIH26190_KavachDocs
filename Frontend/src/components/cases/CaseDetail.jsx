import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiFileText,
  FiFolder,
  FiHash,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import Loader from "../common/Loader";
import DocumentVerify from "../documents/DocumentVerify";
import DocumentVersions from "../documents/DocumentVersions";

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        ENDPOINTS.CASES.DETAIL(id)
      );

      setCaseData(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch case details:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Unable to load case details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const value = status?.toUpperCase();

    if (value === "OPEN" || value === "ACTIVE") {
      return "bg-green-50 text-green-700";
    }

    if (value === "CLOSED") {
      return "bg-slate-100 text-slate-700";
    }

    if (value === "PENDING") {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  const getPriorityClass = (priority) => {
    const value = priority?.toUpperCase();

    if (value === "HIGH" || value === "CRITICAL") {
      return "bg-red-50 text-red-700";
    }

    if (value === "MEDIUM") {
      return "bg-yellow-50 text-yellow-700";
    }

    if (value === "LOW") {
      return "bg-green-50 text-green-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="space-y-4">

        <button
          type="button"
          onClick={() => navigate("/cases")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <FiArrowLeft />
          Back to Cases
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-800">
            {error}
          </p>
        </div>

      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">

        <FiFolder
          className="mx-auto mb-3 text-slate-400"
          size={36}
        />

        <p className="font-medium text-slate-700">
          Case not found
        </p>

      </div>
    );
  }

  const documents =
    caseData.documents ||
    caseData.document_list ||
    [];

  return (
    <div className="space-y-6">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/cases")}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <FiArrowLeft size={17} />
        Back to Cases
      </button>

      {/* Case Header */}
      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <FiFolder
                  className="text-slate-700"
                  size={24}
                />
              </div>

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Case Number
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                  {caseData.case_number ||
                    caseData.caseNumber ||
                    `CASE-${id}`}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {caseData.title ||
                    caseData.name ||
                    "Case Details"}
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-2">

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                  caseData.status
                )}`}
              >
                {caseData.status || "UNKNOWN"}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getPriorityClass(
                  caseData.priority
                )}`}
              >
                {caseData.priority || "NORMAL"} Priority
              </span>

            </div>

          </div>

        </div>

        {/* Case Information */}
        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="flex items-start gap-3">

            <FiHash className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Case ID
              </p>

              <p className="mt-1 break-all text-sm font-medium text-slate-800">
                {caseData.id || id}
              </p>
            </div>

          </div>

          <div className="flex items-start gap-3">

            <FiFolder className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Case Type
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {caseData.type ||
                  caseData.case_type ||
                  "—"}
              </p>
            </div>

          </div>

          <div className="flex items-start gap-3">

            <FiUser className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Assigned Officer
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {caseData.assigned_officer ||
                  caseData.officer ||
                  "—"}
              </p>
            </div>

          </div>

          <div className="flex items-start gap-3">

            <FiCalendar className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Created
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {caseData.created_at
                  ? new Date(
                      caseData.created_at
                    ).toLocaleDateString()
                  : "—"}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Description */}
      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 p-5">

          <h2 className="font-semibold text-slate-900">
            Case Description
          </h2>

        </div>

        <div className="p-5">

          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {caseData.description ||
              "No case description available."}
          </p>

        </div>

      </div>

      {/* Documents */}
      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <FiFileText
                className="text-slate-600"
                size={19}
              />

              <h2 className="font-semibold text-slate-900">
                Case Documents
              </h2>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Documents associated with this case.
            </p>

          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {documents.length}{" "}
            {documents.length === 1
              ? "Document"
              : "Documents"}
          </span>

        </div>

        <div className="p-5">

          {documents.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

              <FiFileText
                className="mx-auto mb-3 text-slate-400"
                size={34}
              />

              <p className="font-medium text-slate-700">
                No documents available
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Documents uploaded for this case will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {documents.map((document, index) => {

                const documentId =
                  document.id ||
                  document.document_id;

                return (
                  <div
                    key={documentId || index}
                    className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">

                        <FiFileText
                          className="text-slate-600"
                          size={20}
                        />

                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-medium text-slate-900">
                          {document.title ||
                            document.filename ||
                            "Untitled Document"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {document.filename ||
                            document.document_type ||
                            "Document"}
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDocument(
                            document
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <FiShield size={15} />
                        Verify
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </div>

      {/* Document Security */}
      {selectedDocument && (

        <div className="space-y-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Document Security
              </h2>

              <p className="text-sm text-slate-500">
                {selectedDocument.title ||
                  selectedDocument.filename ||
                  "Selected Document"}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedDocument(null)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>

          </div>

          <DocumentVerify
            documentId={
              selectedDocument.id ||
              selectedDocument.document_id
            }
          />

          <DocumentVersions
            documentId={
              selectedDocument.id ||
              selectedDocument.document_id
            }
          />

        </div>

      )}

    </div>
  );
};

export default CaseDetail;