import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("login"); // login | register | forgot
  const [showPassword, setShowPassword] = useState(false);
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [forgotStep, setForgotStep] = useState("email");

  // ---------------- Handlers ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword)
      return toast.error("Enter email and password");

    try {
      const res = await axios.post(`${SERVER_URL}/login`, {
        email: loginEmail,
        password: loginPassword,
      });
      if (res.data.message === "success") {
        localStorage.setItem("isAuthenticated", "true");
         toast.success("Login successful");
        navigate("/dashboard");
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword)
      return toast.error("Enter email and password");

    try {
      const res = await axios.post(`${SERVER_URL}/sign_in`, {
        email: registerEmail,
        password: registerPassword,
      });

      if (res.data.message === "Saved in Database") {
        toast.success("Registered successfully!");
        // Clear form
        setRegisterEmail("");
        setRegisterPassword("");
        // Switch to login page
        setActivePage("login");
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleSendOTP = async () => {
    if (!forgotEmail) return toast.error("Enter your email");
    try {
      const res = await axios.post(`${SERVER_URL}/forget_password`, {
        email: forgotEmail,
      });
      setOtp(res.data.message);
      toast.success("OTP sent to your email");
      setForgotStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = () => {
    if (!otpValue || otpValue.length !== 6)
      return toast.error("Enter complete OTP");
    if (otpValue === otp) {
      toast.success("OTP verified");
      setForgotStep("reset");
    } else toast.error("Invalid OTP");
  };

  const handlePasswordReset = async () => {
    if (!resetPassword) return toast.error("Enter new password");

    try {
      const res = await axios.post(`${SERVER_URL}/reset_password`, {
        email: forgotEmail,
        otp,
        resetpassword: resetPassword,
      });

      if (res.data.message === "success") {
        toast.success("Password reset successful!");
        // Clear all forgot password states
        setForgotEmail("");
        setOtpValue("");
        setResetPassword("");
        setOtp("");
        setForgotStep("email");
        // Switch to login page
        setActivePage("login");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-950 to-black p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10 grid md:grid-cols-2 gap-8 items-center">
        {/* Left Branding */}
        <div className="text-white space-y-6 hidden md:block">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-yellow-500/30">
            <Building2 className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold">Ikhas Admin</h1>
              <p className="text-yellow-200 text-sm">Management Platform</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Manage Your Real Estate Portfolio
          </h2>
          <p className="text-yellow-200 text-lg">
            Streamline operations, track properties, and grow your business with our
            management platform.
          </p>
        </div>

        {/* Right Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full">
          {/* LOGIN */}
          {activePage === "login" && (
            <>
              <h2 className="text-3xl text-blue-900 font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-600 mb-6">Sign in to access your dashboard</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-yellow-600 font-semibold"
                    onClick={() => setActivePage("register")}
                  >
                    Sign Up
                  </button>
                </p>
                <p>
                  <button
                    type="button"
                    className="text-blue-600 font-semibold"
                    onClick={() => setActivePage("forgot")}
                  >
                    Forgot Password?
                  </button>
                </p>
              </div>
            </>
          )}

          {/* REGISTER */}
          {activePage === "register" && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white py-3 rounded-xl font-semibold"
                >
                  Create Account
                </button>
              </form>
              <button
                type="button"
                onClick={() => setActivePage("login")}
                className="text-blue-600 font-semibold w-full mt-4"
              >
                Back to Login
              </button>
            </>
          )}

          {/* FORGOT PASSWORD */}
          {activePage === "forgot" && (
            <>
              {forgotStep === "email" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center">Reset Password</h2>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-3 pr-3 py-3 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  >
                    Send OTP
                  </button>
                </>
              )}

              {forgotStep === "otp" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center">Verify OTP</h2>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    className="w-full text-center py-3 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-yellow-500 text-2xl tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {forgotStep === "reset" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center">New Password</h2>
                  <div className="relative mb-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      className="w-full pl-3 pr-12 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  >
                    Reset Password
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setActivePage("login");
                  setForgotStep("email");
                  setForgotEmail("");
                  setOtpValue("");
                  setResetPassword("");
                  setOtp("");
                }}
                className="text-blue-600 font-semibold w-full mt-4"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}