import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";

const CaseCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    case_number: "",
    title: "",
    type: "",
    description: "",
    priority: "MEDIUM",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await api.post(
        ENDPOINTS.CASES.CREATE,
        form
      );

      navigate(
        `/cases/${response.data.id}`
      );
    } catch (error) {
      console.error(
        "Failed to create case",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Create Case
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Register a new investigation case.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6"
      >

        <input
          name="case_number"
          value={form.case_number}
          onChange={handleChange}
          placeholder="Case Number"
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
          required
        />

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Case Title"
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
          required
        />

        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Case Type"
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Case Description"
          rows={5}
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
        />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <button
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
        >
          {loading
            ? "Creating..."
            : "Create Case"}
        </button>

      </form>

    </div>
  );
};

export default CaseCreate;