import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import Toast from "./components/toast";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const navigate = useNavigate();

    // Redirect to /admin if already logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) navigate("/admin", { replace: true });
        });
        return () => unsubscribe();
    }, [navigate]);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            //showToast("Login successful!", "success");
            navigate("/admin", { replace: true });
        } catch (error: any) {
            console.error("Login error:", error);
            showToast(error.message || "Login failed. Check credentials.", "error");
        } finally {
            setIsLoading(false);
        }
    };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter your email first.", "error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent. Check your inbox.", "success");
      setShowForgot(false);
    } catch (error: any) {
      console.error("Reset error:", error);
      showToast(error.message || "Failed to send reset email.", "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 sm:p-10 animate-fadeIn">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {showForgot ? "Reset Password" : "Admin Login"}
        </h2>

        <form onSubmit={showForgot ? handleForgotPassword : handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          {!showForgot && (
            <div>
              <label className="block text-gray-600 font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            {isLoading ? "Please wait..." : showForgot ? "Send Reset Link" : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          {!showForgot ? (
            <button
              onClick={() => setShowForgot(true)}
              className="text-indigo-600 hover:underline text-sm"
            >
              Forgot password?
            </button>
          ) : (
            <button
              onClick={() => setShowForgot(false)}
              className="text-gray-600 hover:underline text-sm"
            >
              Back to login
            </button>
          )}
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
