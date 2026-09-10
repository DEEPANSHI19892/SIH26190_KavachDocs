import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiShield,
  FiUser,
} from "react-icons/fi";

import Layout from "../components/common/Layout";

const AuditPage = () => {
  const auditLogs = [
    {
      action: "Document uploaded",
      description: "Document uploaded to Case KVD-2026-001",
      user: "Investigation Officer",
      time: "1 hour ago",
      type: "Document",
      icon: FiFileText,
    },
    {
      action: "Document verified",
      description: "Document integrity verification completed",
      user: "Investigation Officer",
      time: "2 hours ago",
      type: "Verification",
      icon: FiCheckCircle,
    },
    {
      action: "Case created",
      description: "New case KVD-2026-009 was created",
      user: "Admin User",
      time: "3 hours ago",
      type: "Case",
      icon: FiShield,
    },
    {
      action: "Security event resolved",
      description: "Security event was marked as resolved",
      user: "Admin User",
      time: "4 hours ago",
      type: "Security",
      icon: FiShield,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Audit Logs
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review system activity and audit history.
          </p>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-3">
                <FiFileText
                  size={20}
                  className="text-slate-700"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Activities
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  1,248
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-3">
                <FiUser
                  size={20}
                  className="text-slate-700"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Active Users
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  24
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-3">
                <FiCheckCircle
                  size={20}
                  className="text-slate-700"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Verified Activities
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  99.8%
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Audit Logs Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Audit Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                System activity recorded by KavachDocs.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px] text-left">

              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Activity
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Time
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {auditLogs.map((log, index) => {
                  const Icon = log.icon;

                  return (
                    <tr
                      key={index}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-start gap-3">

                          <div className="mt-0.5 rounded-lg bg-slate-100 p-2">
                            <Icon
                              size={17}
                              className="text-slate-700"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {log.action}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {log.description}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {log.user}
                      </td>

                      <td className="px-5 py-4">

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {log.type}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <FiClock size={14} />
                          {log.time}
                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default AuditPage;