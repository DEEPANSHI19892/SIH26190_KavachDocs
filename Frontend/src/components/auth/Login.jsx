import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiLock,
  FiMail,
  FiShield,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  // --------------------------------------------------
  // REAL LOGIN
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await login(email.trim(), password);

      const savedUser = JSON.parse(
        localStorage.getItem("kavachdocs_user") || "null"
      );

      const role = data?.user?.role || data?.role || savedUser?.role;

      // ADMIN
      if (role === "ADMIN") {
        navigate("/dashboard");
      }
      // Investigation Officer
      else if (role === "INVESTIGATION_OFFICER") {
        navigate("/cases");
      }
      // Legal Officer
      else if (role === "LEGAL_OFFICER") {
        navigate("/cases");
      }
      // Viewer
      else if (role === "VIEWER") {
        navigate("/cases");
      }
      // Fallback
      else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* ==================================================
          LEFT BRANDING SECTION
      ================================================== */}

      <div className="hidden w-1/2 bg-slate-900 lg:flex">
        <div className="flex w-full flex-col justify-between p-12 text-white">

          {/* Brand */}
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900">
                <FiShield size={27} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">KavachDocs</h1>
                <p className="text-sm text-slate-400">
                  Secure Document Management
                </p>
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="max-w-xl text-4xl font-bold leading-tight">
              Secure documentation for legal and investigation cases.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Manage case documents, verification, versions and security
              records through one secure platform.
            </p>
          </div>

          {/* Bottom */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <FiShield size={15} />
              <span>Secure & authenticated platform</span>
            </div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} KavachDocs
            </p>
          </div>

        </div>
      </div>

      {/* ==================================================
          RIGHT LOGIN SECTION
      ================================================== */}

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile Branding */}
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white">
                <FiShield size={23} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  KavachDocs
                </h1>
                <p className="text-xs text-slate-500">
                  Secure Document Management
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              LOGIN CARD
          ================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
              <p className="mt-2 text-sm text-slate-500">
                Access your secure case workspace.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ==================================================
                LOGIN FORM
            ================================================== */}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <FiMail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <FiLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Security Information */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Authorized users only</span>
                <span className="flex items-center gap-1">
                  <FiShield size={13} />
                  Secure access
                </span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* ==================================================
                DEMO CREDENTIALS
            ================================================== */}

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Demo Credentials
              </p>

              <div className="space-y-2">

                <button
                  type="button"
                  onClick={() =>
                    fillCredentials("admin@kavachdocs.in", "Admin@123")
                  }
                  className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-xs transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-700">Admin</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    admin@kavachdocs.in
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    fillCredentials("officer@kavachdocs.in", "Officer@123")
                  }
                  className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-xs transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-700">
                    Investigation Officer
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    officer@kavachdocs.in
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    fillCredentials("legal@kavachdocs.in", "Legal@123")
                  }
                  className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-xs transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-700">
                    Legal Officer
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    legal@kavachdocs.in
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    fillCredentials("viewer@kavachdocs.in", "Viewer@123")
                  }
                  className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-xs transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-700">Viewer</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    viewer@kavachdocs.in
                  </span>
                </button>

              </div>

              <p className="mt-3 text-[10px] text-slate-400">
                Click any role to auto-fill credentials
              </p>
            </div>

            {/* Bottom Security */}
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
              <FiShield size={14} />
              <span>Secure authenticated access</span>
            </div>

          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-slate-400">
            Protected access • Authorized personnel only
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;