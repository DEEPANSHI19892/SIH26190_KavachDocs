import { useEffect, useState } from "react";
import { FiEye, FiSearch, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import Loader from "../common/Loader";

const CaseList = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(ENDPOINTS.CASES.LIST);

      console.log("Cases API response:", response.data);

      // Handle different possible backend response formats
      let caseData = [];

      if (Array.isArray(response.data)) {
        caseData = response.data;
      } else if (Array.isArray(response.data?.cases)) {
        caseData = response.data.cases;
      } else if (Array.isArray(response.data?.data)) {
        caseData = response.data.data;
      } else if (Array.isArray(response.data?.items)) {
        caseData = response.data.items;
      }

      setCases(caseData);
    } catch (error) {
      console.error("Failed to fetch cases:", error);

      setCases([]);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to load cases. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases = cases.filter((item) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      String(item.case_number || "")
        .toLowerCase()
        .includes(query) ||
      String(item.title || "")
        .toLowerCase()
        .includes(query) ||
      String(item.type || "")
        .toLowerCase()
        .includes(query) ||
      String(item.status || "")
        .toLowerCase()
        .includes(query)
    );
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="font-semibold text-slate-900">
            Investigation Cases
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View and manage investigation cases
          </p>
        </div>

        <div className="flex w-full gap-2 md:w-auto">

          {/* Search */}
          <div className="relative w-full md:w-72">

            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cases..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-200"
            />

          </div>

          {/* Refresh */}
          <button
            onClick={fetchCases}
            disabled={loading}
            title="Refresh cases"
            className="rounded-lg border border-slate-300 px-3 text-slate-600 transition hover:bg-slate-50"
          >
            <FiRefreshCw size={17} />
          </button>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchCases}
            className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Try Again
          </button>

        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-left text-sm">

          <thead className="bg-slate-50 text-xs uppercase text-slate-500">

            <tr>
              <th className="px-5 py-3">
                Case Number
              </th>

              <th className="px-5 py-3">
                Title
              </th>

              <th className="px-5 py-3">
                Type
              </th>

              <th className="px-5 py-3">
                Status
              </th>

              <th className="px-5 py-3">
                Priority
              </th>

              <th className="px-5 py-3">
                Action
              </th>
            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {filteredCases.length > 0 ? (

              filteredCases.map((item, index) => (

                <tr
                  key={item.id || item.case_number || index}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {item.case_number || "—"}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {item.title || "Untitled Case"}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.type || "—"}
                  </td>

                  <td className="px-5 py-4">

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      {item.status || "Unknown"}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.priority || "—"}
                  </td>

                  <td className="px-5 py-4">

                    <button
                      onClick={() =>
                        navigate(`/cases/${item.id}`)
                      }
                      title="View case"
                      className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <FiEye size={18} />
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="px-5 py-12 text-center"
                >

                  <div className="text-sm font-medium text-slate-600">
                    {search
                      ? "No cases found"
                      : "No cases available"}
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    {search
                      ? "Try changing your search."
                      : "Cases will appear here when they are available."}
                  </p>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-5 py-3">

        <p className="text-xs text-slate-500">
          Showing {filteredCases.length} of {cases.length} cases
        </p>

      </div>

    </div>
  );
};

export default CaseList;