import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiShield,
  FiUser,
} from "react-icons/fi";

import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import Loader from "../common/Loader";

const SecurityEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        ENDPOINTS.SECURITY.EVENTS
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.events || [];

      setEvents(data);
    } catch (error) {
      console.error(
        "Failed to fetch security events:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Unable to load security events."
      );
    } finally {
      setLoading(false);
    }
  };

  const resolveEvent = async (id) => {
    try {
      setResolvingId(id);

      await api.post(
        ENDPOINTS.SECURITY.RESOLVE(id)
      );

      setEvents((previousEvents) =>
        previousEvents.map((event) =>
          event.id === id
            ? {
                ...event,
                status: "RESOLVED",
                resolved: true,
              }
            : event
        )
      );
    } catch (error) {
      console.error(
        "Failed to resolve security event:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Unable to resolve this security event."
      );
    } finally {
      setResolvingId(null);
    }
  };

  const getSeverityClass = (severity) => {
    const value = severity?.toUpperCase();

    if (value === "CRITICAL") {
      return "bg-red-100 text-red-800";
    }

    if (value === "HIGH") {
      return "bg-orange-100 text-orange-800";
    }

    if (value === "MEDIUM") {
      return "bg-yellow-100 text-yellow-800";
    }

    if (value === "LOW") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const getStatusClass = (status) => {
    const value = status?.toUpperCase();

    if (
      value === "RESOLVED" ||
      value === "CLOSED"
    ) {
      return "bg-green-50 text-green-700";
    }

    return "bg-red-50 text-red-700";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
            <FiShield
              className="text-slate-700"
              size={22}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Security Events
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor suspicious and security-related activities.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchSecurityEvents}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
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

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <FiShield className="text-slate-500" />

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total Events
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {events.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-red-500" />

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Open Events
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {
                  events.filter(
                    (event) =>
                      event.status?.toUpperCase() !==
                        "RESOLVED" &&
                      event.resolved !== true
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-green-500" />

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Resolved
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {
                  events.filter(
                    (event) =>
                      event.status?.toUpperCase() ===
                        "RESOLVED" ||
                      event.resolved === true
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-orange-500" />

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                High / Critical
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {
                  events.filter((event) => {
                    const severity =
                      event.severity?.toUpperCase();

                    return (
                      severity === "HIGH" ||
                      severity === "CRITICAL"
                    );
                  }).length
                }
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Security Events Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">
            Security Event Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review and resolve detected security events.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Event
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Severity
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Time
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {events.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <FiShield
                      className="mx-auto mb-3 text-slate-300"
                      size={38}
                    />

                    <p className="font-medium text-slate-700">
                      No security events found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      No security-related events are currently available.
                    </p>
                  </td>
                </tr>
              ) : (
                events.map((event, index) => {
                  const eventId =
                    event.id ||
                    event.event_id;

                  const isResolved =
                    event.status?.toUpperCase() ===
                      "RESOLVED" ||
                    event.resolved === true;

                  return (
                    <tr
                      key={eventId || index}
                      className="hover:bg-slate-50"
                    >

                      {/* Event */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <FiAlertTriangle
                              className="text-slate-600"
                              size={17}
                            />
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {event.event_type ||
                                event.type ||
                                event.event ||
                                "Security Event"}
                            </p>

                            <p className="mt-1 max-w-md text-xs text-slate-500">
                              {event.description ||
                                event.message ||
                                "No description available."}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-slate-400" />

                          <span className="text-slate-700">
                            {event.username ||
                              event.user_name ||
                              event.user ||
                              event.user_id ||
                              "System"}
                          </span>
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getSeverityClass(
                            event.severity
                          )}`}
                        >
                          {event.severity || "UNKNOWN"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            event.status ||
                              (event.resolved
                                ? "RESOLVED"
                                : "OPEN")
                          )}`}
                        >
                          {event.status ||
                            (event.resolved
                              ? "RESOLVED"
                              : "OPEN")}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="px-5 py-4 text-slate-500">
                        <div className="flex items-center gap-2">
                          <FiClock />

                          {event.created_at ||
                          event.timestamp
                            ? new Date(
                                event.created_at ||
                                  event.timestamp
                              ).toLocaleString()
                            : "—"}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                            <FiCheckCircle />
                            Resolved
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              !eventId ||
                              resolvingId === eventId
                            }
                            onClick={() =>
                              resolveEvent(eventId)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                          >
                            <FiCheckCircle />

                            {resolvingId === eventId
                              ? "Resolving..."
                              : "Resolve"}
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SecurityEvents;