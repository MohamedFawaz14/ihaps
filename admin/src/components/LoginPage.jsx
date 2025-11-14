import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2 } from "lucide-react";
import {toast} from 'sonner';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function LoginPage() {
  const navigate   = useNavigate();
  const [activePage, setActivePage] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("user"); // user or master
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Master credentials
  const MASTER_EMAIL = "ikhlas@master.com";
  const MASTER_PASSWORD = "ikhlas@master123";

const handleLogin = async (e) => {
  e.preventDefault();

  // Common field check
  if (!loginEmail || !loginPassword) {
    return toast.error("Enter email and password");
  }

  if (loginType === "master") {
    // 🔐 Master credentials (local check)
    const MASTER_EMAIL = "ikhlas@master.com";
    const MASTER_PASS = "ikhlas@master123";

    if (loginEmail === MASTER_EMAIL && loginPassword === MASTER_PASS) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", "master");
      toast.success("Master login successful");
      navigate("/dashboard");
    } else {
      toast.error("Invalid Master credentials");
    }
  } else {
    // 👤 User login (backend validation)
    console.log(loginEmail,loginPassword)
    try {
      const res = await axios.post(`${SERVER_URL}/login`, {
        email:loginEmail,
        password:loginPassword,
      });
      console.log("User login response:", res.data);

      if (res.data.message === "success") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", "user");
        localStorage.setItem("userEmail", loginEmail);
        toast.success("User login successful");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Invalid user credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  }
};
  // const handleRegister = (e) => {
  //   e.preventDefault();
  //   if (!registerEmail || !registerPassword) {
  //     setMessage("Enter email and password");
  //     return;
  //   }
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setMessage("Registration successful!");
  //     setRegisterEmail("");
  //     setRegisterPassword("");
  //     setActivePage("login");
  //   }, 1500);
  // };

  // const handleSendOTP = () => {
  //   if (!forgotEmail) {
  //     setMessage("Enter your email");
  //     return;
  //   }
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setOtp("123456");
  //     setMessage("OTP sent to your email");
  //     setForgotStep("otp");
  //   }, 1500);
  // };

  // const handleVerifyOTP = () => {
  //   if (!otpValue || otpValue.length !== 6) {
  //     setMessage("Enter complete OTP");
  //     return;
  //   }
  //   if (otpValue === "123456") {
  //     setMessage("OTP verified");
  //     setForgotStep("reset");
  //   } else {
  //     setMessage("Invalid OTP");
  //   }
  // };

  // const handlePasswordReset = () => {
  //   if (!resetPassword) {
  //     setMessage("Enter new password");
  //     return;
  //   }
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setMessage("Password reset successful!");
  //     setForgotEmail("");
  //     setOtpValue("");
  //     setResetPassword("");
  //     setOtp("");
  //     setForgotStep("email");
  //     setActivePage("login");
  //   }, 1500);
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10 grid 
      grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Branding - Hidden on Mobile */}
        <div className="text-white space-y-6 hidden md:block">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-yellow-400/30">
            <Building2 className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold">Ikhlas Admin</h1>
              <p className="text-yellow-300 text-sm">Management Platform</p>
            </div>
          </div>
          <h2 className="text-5xl font-bold leading-tight">
            Manage Your Real Estate Portfolio
          </h2>
          <p className="text-yellow-300 text-lg">
            Streamline operations, track properties, and grow your business with our
            comprehensive management platform.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Advanced property tracking</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Secure tenant management</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Real-time reporting</span>
            </div>
          </div>
        </div>

        {/* Right Form - Glassmorphic Card */}
        <div className="backdrop-blur-xl bg-transparent border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 w-full">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Ikhlas Admin</h1>
              <p className="text-yellow-300 text-xs">Management Platform</p>
            </div>
          </div>

          {/* LOGIN */}
          {activePage === "login" && (
            <>
              <h2 className="text-3xl text-white font-bold mb-2">Welcome Back</h2>
              <p className="text-white/70 mb-6">Sign in to access your dashboard</p>

              {/* Account Type Selector */}
              <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-lg border border-white/20">
                <button
                  onClick={() => {
                    setLoginType("user");
                    setMessage("");
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-sm transition duration-200 ${
                    loginType === "user"
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-950 shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  User
                </button>
                <button
                  onClick={() => {
                    setLoginType("master");
                    setMessage("");
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-sm transition duration-200 ${
                    loginType === "master"
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-950 shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Master
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400/70 group-focus-within:text-yellow-400 transition" />
                  <input
                    type="email"
                    placeholder={loginType === "master" ? "ikhlas@master.com" : "Email address"}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400/70 group-focus-within:text-yellow-400 transition" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={loginType === "master" ? "ikhlas@master123" : "Password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-yellow-400 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {message && (
                  <div className={`text-sm p-3 rounded-lg font-medium ${
                    message.includes("successful")
                      ? "bg-green-400/20 text-green-200 border border-green-400/30"
                      : "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-60 text-blue-950 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-950 border-t-transparent"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-950 ">Sign In Securely</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Note: Sign Up and Forgot Password commented out */}
              {/* 
              <div className="mt-6 text-center space-y-3">
                <p className="text-white/70">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-yellow-400 font-semibold hover:text-yellow-300 transition"
                    onClick={() => {
                      setActivePage("register");
                      setMessage("");
                    }}
                  >
                    Sign Up
                  </button>
                </p>
                <p>
                  <button
                    type="button"
                    className="text-white/70 hover:text-yellow-400 font-semibold transition"
                    onClick={() => {
                      setActivePage("forgot");
                      setMessage("");
                    }}
                  >
                    Forgot Password?
                  </button>
                </p>
              </div>
              */}
            </>
          )}

          {/* REGISTER - COMMENTED OUT */}
          {/* {activePage === "register" && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h2>
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400/70 group-focus-within:text-yellow-400 transition" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400/70 group-focus-within:text-yellow-400 transition" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition"
                  />
                </div>

                {message && (
                  <div className={`text-sm p-3 rounded-lg font-medium ${
                    message.includes("successful")
                      ? "bg-green-400/20 text-green-200 border border-green-400/30"
                      : "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-60 text-blue-950 py-3 rounded-xl font-bold transition transform hover:scale-105"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActivePage("login");
                  setMessage("");
                }}
                className="text-white/70 hover:text-yellow-400 font-semibold w-full mt-4 transition"
              >
                Back to Login
              </button>
            </>
          )} */}

          {/* FORGOT PASSWORD - COMMENTED OUT */}
          {/* {activePage === "forgot" && (
            <>
              {forgotStep === "email" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center text-white">Reset Password</h2>
                  <div className="space-y-4">
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400/70 group-focus-within:text-yellow-400 transition" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition"
                      />
                    </div>

                    {message && (
                      <div className={`text-sm p-3 rounded-lg font-medium ${
                        message.includes("successful") || message.includes("sent")
                          ? "bg-green-400/20 text-green-200 border border-green-400/30"
                          : "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                      }`}>
                        {message}
                      </div>
                    )}

                    <button
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-60 text-blue-950 py-3 rounded-xl font-bold transition transform hover:scale-105"
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </div>
                </>
              )}

              {forgotStep === "otp" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center text-white">Verify OTP</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-center py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 text-2xl tracking-widest transition"
                    />

                    {message && (
                      <div className={`text-sm p-3 rounded-lg font-medium ${
                        message.includes("verified")
                          ? "bg-green-400/20 text-green-200 border border-green-400/30"
                          : "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                      }`}>
                        {message}
                      </div>
                    )}

                    <button
                      onClick={handleVerifyOTP}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-950 py-3 rounded-xl font-bold transition transform hover:scale-105"
                    >
                      Verify OTP
                    </button>
                  </div>
                </>
              )}

              {forgotStep === "reset" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center text-white">New Password</h2>
                  <div className="space-y-4">
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400/70 group-focus-within:text-yellow-400 transition" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-yellow-400 transition"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {message && (
                      <div className={`text-sm p-3 rounded-lg font-medium ${
                        message.includes("successful")
                          ? "bg-green-400/20 text-green-200 border border-green-400/30"
                          : "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                      }`}>
                        {message}
                      </div>
                    )}

                    <button
                      onClick={handlePasswordReset}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-60 text-blue-950 py-3 rounded-xl font-bold transition transform hover:scale-105"
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>
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
                  setMessage("");
                }}
                className="text-white/70 hover:text-yellow-400 font-semibold w-full mt-4 transition"
              >
                Back to Login
              </button>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
}