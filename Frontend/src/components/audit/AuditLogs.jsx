import { useEffect, useState } from "react";
import {
  FiActivity,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiUser,
} from "react-icons/fi";

import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import Loader from "../common/Loader";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        ENDPOINTS.AUDIT.LOGS
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.logs || [];

      setLogs(data);
    } catch (error) {
      console.error(
        "Failed to fetch audit logs:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Unable to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const query = search.toLowerCase();

    return (
      log.action
        ?.toLowerCase()
        .includes(query) ||
      log.username
        ?.toLowerCase()
        .includes(query) ||
      log.user_name
        ?.toLowerCase()
        .includes(query) ||
      log.resource
        ?.toLowerCase()
        .includes(query) ||
      log.description
        ?.toLowerCase()
        .includes(query) ||
      log.ip_address
        ?.toLowerCase()
        .includes(query)
    );
  });

  const getActionClass = (action) => {
    const value = action?.toUpperCase();

    if (
      value?.includes("DELETE") ||
      value?.includes("REMOVE")
    ) {
      return "bg-red-50 text-red-700";
    }

    if (
      value?.includes("UPLOAD") ||
      value?.includes("CREATE")
    ) {
      return "bg-green-50 text-green-700";
    }

    if (
      value?.includes("UPDATE") ||
      value?.includes("EDIT")
    ) {
      return "bg-yellow-50 text-yellow-700";
    }

    if (
      value?.includes("LOGIN") ||
      value?.includes("LOGOUT")
    ) {
      return "bg-blue-50 text-blue-700";
    }

    if (
      value?.includes("VERIFY") ||
      value?.includes("DOWNLOAD")
    ) {
      return "bg-purple-50 text-purple-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
              <FiActivity
                className="text-slate-700"
                size={22}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Audit Logs
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track user activities and system actions.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchAuditLogs}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <FiRefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <FiActivity className="text-slate-500" />

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total Activities
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {logs.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <FiUser className="text-slate-500" />

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Unique Users
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {
                  new Set(
                    logs
                      .map(
                        (log) =>
                          log.username ||
                          log.user_name ||
                          log.user_id
                      )
                      .filter(Boolean)
                  ).size
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <FiClock className="text-slate-500" />

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Latest Activity
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {logs.length > 0
                  ? logs[0].created_at ||
                    logs[0].timestamp
                    ? new Date(
                        logs[0].created_at ||
                          logs[0].timestamp
                      ).toLocaleString()
                    : "Available"
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative max-w-md">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search audit logs..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">
            Activity Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete record of actions performed in KavachDocs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Resource
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  IP Address
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <FiActivity
                      className="mx-auto mb-3 text-slate-300"
                      size={38}
                    />

                    <p className="font-medium text-slate-700">
                      No audit logs found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr
                    key={
                      log.id ||
                      log.log_id ||
                      index
                    }
                    className="transition hover:bg-slate-50"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                          <FiUser
                            className="text-slate-600"
                            size={16}
                          />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {log.username ||
                              log.user_name ||
                              log.user ||
                              log.user_id ||
                              "System"}
                          </p>

                          {log.role && (
                            <p className="text-xs text-slate-500">
                              {log.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getActionClass(
                          log.action
                        )}`}
                      >
                        {log.action ||
                          log.event_type ||
                          "ACTION"}
                      </span>
                    </td>

                    {/* Resource */}
                    <td className="px-5 py-4">
                      <span className="text-slate-700">
                        {log.resource ||
                          log.resource_type ||
                          log.entity ||
                          "—"}
                      </span>

                      {log.resource_id && (
                        <p className="mt-1 text-xs text-slate-400">
                          ID: {log.resource_id}
                        </p>
                      )}
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4">
                      <p className="max-w-sm text-slate-600">
                        {log.description ||
                          log.message ||
                          "No description available."}
                      </p>
                    </td>

                    {/* IP */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-slate-500">
                        {log.ip_address ||
                          log.ip ||
                          "—"}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <FiClock />

                        <span className="whitespace-nowrap">
                          {log.created_at ||
                          log.timestamp ||
                          log.occurred_at
                            ? new Date(
                                log.created_at ||
                                  log.timestamp ||
                                  log.occurred_at
                              ).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;