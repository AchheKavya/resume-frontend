
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// type Step = "email" | "otp" | "reset" | "done";

// const ForgotPassword = () => {
//   const [step, setStep] = useState<Step>("email");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { toast } = useToast();

//   const API_BASE = "http://127.0.0.1:8000/api/";

//   // STEP 1: Send OTP email
//   const handleEmailSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError("Please enter a valid email");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const res = await axios.post(`${API_BASE}forgot-password/`, {
//         email: email,
//       });

//       toast({
//         title: "OTP Sent",
//         description: res.data.message || "Check your email for the verification code.",
//       });

//       setStep("otp");
//     } catch (err: any) {
//       console.error("Forgot Password Error:", err.response?.data || err.message);

//       setError(err.response?.data?.error || "Failed to send OTP");
//       toast({
//         title: "Error",
//         description: err.response?.data?.error || "Failed to send OTP",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // STEP 2: Verify OTP only on frontend, move to reset screen
//   // const handleOtpSubmit = (e: React.FormEvent) => {
//   //   e.preventDefault();

//   //   if (otp.length < 6) {
//   //     setError("Please enter the full OTP");
//   //     return;
//   //   }

//   //   setError("");
//   //   setStep("reset");
//   // };const handleOtpSubmit = async (e: React.FormEvent) => {
//   const handleOtpSubmit = async(e:React.FormEvent) => {
//   e.preventDefault();

//   if (otp.length < 6) {
//     setError("Please enter the full OTP");
//     return;
//   }

//   setError("");

//   try {
//     await axios.post("http://127.0.0.1:8000/api/verify-otp/", {
//       email: email,
//       otp: otp,
//     });

//     setStep("reset");

//   } catch (err: any) {
//     console.error(err.response?.data || err.message);

//     setError(err.response?.data?.error || "Invalid OTP");

//     toast({
//       title: "Invalid OTP",
//       description: err.response?.data?.error || "Please try again",
//       variant: "destructive",
//     });
//   }
// };

//   //step 3:Reset Password
  
// const handleResetSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   // Basic frontend validations
//   if (newPassword.length < 8) {
//     setError("Password must be at least 8 characters");
//     return;
//   }

//   if (newPassword !== confirmPassword) {
//     setError("Passwords do not match");
//     return;
//   }

//   setError("");

//   try {
//     const res = await axios.post("http://127.0.0.1:8000/api/reset-password/", {
//       email: email,
//       otp: otp,
//       new_password: newPassword,
//     });

//     toast({
//       title: "Password Reset Successful",
//       description: res.data.msg || "You can now log in with your new password.",
//     });

//     setStep("done");

//   } catch (err: any) {
//     console.error("Reset Password Error:", err.response?.data || err.message);

//     setError(err.response?.data?.error || "Password reset failed");

//     toast({
//       title: "Reset Failed",
//       description: err.response?.data?.error || "Something went wrong",
//       variant: "destructive",
//     });
//   }
// };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
//             {step === "done" ? (
//               <CheckCircle2 className="w-7 h-7 text-success" />
//             ) : (
//               <KeyRound className="w-7 h-7 text-primary" />
//             )}
//           </div>

//           <h1 className="text-2xl font-bold font-heading text-foreground">
//             {step === "email" && "Forgot Password"}
//             {step === "otp" && "Verify OTP"}
//             {step === "reset" && "Reset Password"}
//             {step === "done" && "All Done!"}
//           </h1>

//           <p className="text-muted-foreground mt-1">
//             {step === "email" && "Enter your email to receive a code"}
//             {step === "otp" && `We sent a code to ${email}`}
//             {step === "reset" && "Choose a new password"}
//             {step === "done" && "Your password has been reset"}
//           </p>
//         </div>

//         {/* STEP 1: EMAIL */}
//         {step === "email" && (
//           <form onSubmit={handleEmailSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="your@email.com"
//               />
//               {error && <p className="text-sm text-destructive">{error}</p>}
//             </div>

//             <Button type="submit" className="w-full h-11" disabled={loading}>
//               {loading ? "Sending..." : "Send OTP"}
//             </Button>
//           </form>
//         )}

//         {/* STEP 2: OTP */}
//         {step === "otp" && (
//           <form onSubmit={handleOtpSubmit} className="space-y-5">
//             <div className="flex justify-center">
//               <InputOTP maxLength={6} value={otp} onChange={setOtp}>
//                 <InputOTPGroup>
//                   {[0, 1, 2, 3, 4, 5].map((i) => (
//                     <InputOTPSlot key={i} index={i} />
//                   ))}
//                 </InputOTPGroup>
//               </InputOTP>
//             </div>

//             {error && <p className="text-sm text-destructive text-center">{error}</p>}

//             <Button type="submit" className="w-full h-11">
//               Verify
//             </Button>
//           </form>
//         )}

//         {/* STEP 3: RESET PASSWORD */}
//         {step === "reset" && (
//           <form onSubmit={handleResetSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="new-password">New Password</Label>
//               <Input
//                 id="new-password"
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 placeholder="Min 8 characters"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirm-password">Confirm Password</Label>
//               <Input
//                 id="confirm-password"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="Re-enter password"
//               />
//             </div>

//             {error && <p className="text-sm text-destructive">{error}</p>}

//             <Button type="submit" className="w-full h-11" disabled={loading}>
//               {loading ? "Resetting..." : "Reset Password"}
//             </Button>
//           </form>
//         )}

//         {/* STEP 4: DONE */}
//         {step === "done" && (
//           <Link to="/login">
//             <Button className="w-full h-11">Back to Login</Button>
//           </Link>
//         )}

//         {step !== "done" && (
//           <p className="text-center text-sm text-muted-foreground mt-6">
//             <Link
//               to="/login"
//               className="text-primary font-medium hover:underline inline-flex items-center gap-1"
//             >
//               <ArrowLeft className="w-3.5 h-3.5" /> Back to login
//             </Link>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
  BarChart3,
  Trophy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Step = "email" | "otp" | "reset" | "done";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { toast } = useToast();

  // const API_BASE = "http://127.0.0.1:8000/api/";
   const API_BASE="https://resume-project-b.onrender.com/api/";

  // STEP 1: Send OTP email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}forgot-password/`, {
        email: email,
      });

      toast({
        title: "OTP Sent",
        description: res.data.message || "Check your email for the verification code.",
      });

      setStep("otp");
    } catch (err: any) {
      console.error("Forgot Password Error:", err.response?.data || err.message);

      setError(err.response?.data?.error || "Failed to send OTP");
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      setError("Please enter the full OTP");
      return;
    }

    setError("");

    try {
      // await axios.post("http://127.0.0.1:8000/api/verify-otp/", {
      await axios.post( "https://resume-project-b.onrender.com/api/verify-otp/", {
        email: email,
        otp: otp,
      });

      setStep("reset");
    } catch (err: any) {
      console.error(err.response?.data || err.message);

      setError(err.response?.data?.error || "Invalid OTP");

      toast({
        title: "Invalid OTP",
        description: err.response?.data?.error || "Please try again",
        variant: "destructive",
      });
    }
  };

  // STEP 3: Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // const res = await axios.post("http://127.0.0.1:8000/api/reset-password/", {
      const res = await axios.post("https://resume-project-b.onrender.com/api/reset-password/", {
        email: email,
        otp: otp,
        new_password: newPassword,
      });

      toast({
        title: "Password Reset Successful",
        description: res.data.msg || "You can now log in with your new password.",
      });

      setStep("done");
    } catch (err: any) {
      console.error("Reset Password Error:", err.response?.data || err.message);

      setError(err.response?.data?.error || "Password reset failed");

      toast({
        title: "Reset Failed",
        description: err.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = () => {
    if (step === "done") return <CheckCircle2 className="w-7 h-7 text-emerald-600" />;
    if (step === "otp") return <ShieldCheck className="w-7 h-7 text-emerald-600" />;
    if (step === "reset") return <LockKeyhole className="w-7 h-7 text-emerald-600" />;
    return <KeyRound className="w-7 h-7 text-emerald-600" />;
  };

  const getStepTitle = () => {
    if (step === "email") return "Forgot Password";
    if (step === "otp") return "Verify OTP";
    if (step === "reset") return "Reset Password";
    return "All Done!";
  };

  const getStepDescription = () => {
    if (step === "email") return "Enter your email to receive a verification code";
    if (step === "otp") return `We sent a 6-digit code to ${email}`;
    if (step === "reset") return "Create a strong new password for your account";
    return "Your password has been reset successfully";
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col">
      <div className="flex-1 grid lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#dff5ea] via-[#eef8f2] to-[#f8fbf9] px-10 xl:px-16 py-10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-80px] left-[-80px] h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute bottom-10 left-10 h-52 w-52 rounded-full bg-emerald-100/60 blur-2xl" />
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                <KeyRound className="h-7 w-7" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Resume<span className="text-emerald-600">Pro</span>
              </h1>
            </Link>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2 text-emerald-600 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              <span className="text-xl font-semibold">Account Recovery</span>
            </div>

            <h2 className="text-5xl xl:text-6xl font-bold leading-tight text-slate-900">
              Securely get
              <br />
              <span className="text-emerald-600">back in.</span>
            </h2>

            <p className="mt-6 max-w-lg text-2xl leading-10 text-slate-600">
              Recover access to your dashboard in a few simple steps and continue your career journey without interruption.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4 rounded-3xl bg-white/60 p-4 shadow-sm backdrop-blur-sm max-w-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">Smart Resume Builder</h3>
                  <p className="text-xl text-slate-600">Create ATS-friendly resumes</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-3xl bg-white/60 p-4 shadow-sm backdrop-blur-sm max-w-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">Track Applications</h3>
                  <p className="text-xl text-slate-600">Manage your job applications</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-3xl bg-white/60 p-4 shadow-sm backdrop-blur-sm max-w-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">Career Growth</h3>
                  <p className="text-xl text-slate-600">Get hired faster</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-10 text-base text-slate-500">
            © 2024 ResumePro. All rights reserved.
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-2xl">
            <div className="mb-6 flex items-center justify-between lg:justify-end">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>

              <div className="hidden sm:flex items-center gap-10 text-base">
                <Link to="/login" className="text-slate-400 hover:text-emerald-600 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="text-slate-400 hover:text-emerald-600 transition-colors">
                  Sign Up
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[28px] bg-emerald-50">
                  {getStepIcon()}
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                  {getStepTitle()}
                </h1>

                <p className="mt-3 text-xl text-slate-500">{getStepDescription()}</p>
              </div>

              {/* STEP 1: EMAIL */}
              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-lg font-semibold text-slate-900">
                      Email Address
                    </Label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-14 rounded-2xl border-slate-300 pl-12 text-base shadow-none focus-visible:ring-emerald-500"
                      />
                    </div>

                    {error && (
                      <p className="text-sm font-medium text-red-500">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="h-14 w-full rounded-2xl bg-emerald-600 text-base font-semibold hover:bg-emerald-700"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              )}

              {/* STEP 2: OTP */}
              {step === "otp" && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label className="block text-center text-lg font-semibold text-slate-900">
                      Enter Verification Code
                    </Label>

                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup className="gap-2 sm:gap-3">
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-slate-300 text-lg"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {error && (
                      <p className="text-center text-sm font-medium text-red-500">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="h-14 w-full rounded-2xl bg-emerald-600 text-base font-semibold hover:bg-emerald-700"
                  >
                    Verify OTP
                  </Button>
                </form>
              )}

              {/* STEP 3: RESET PASSWORD */}
              {step === "reset" && (
                <form onSubmit={handleResetSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="new-password" className="text-lg font-semibold text-slate-900">
                      New Password
                    </Label>

                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="h-14 rounded-2xl border-slate-300 pl-12 pr-12 text-base shadow-none focus-visible:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirm-password" className="text-lg font-semibold text-slate-900">
                      Confirm Password
                    </Label>

                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="h-14 rounded-2xl border-slate-300 pl-12 pr-12 text-base shadow-none focus-visible:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm font-medium text-red-500">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="h-14 w-full rounded-2xl bg-emerald-600 text-base font-semibold hover:bg-emerald-700"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}

              {/* STEP 4: DONE */}
              {step === "done" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-center text-sm text-emerald-700">
                    Your password was updated successfully. You can now sign in with your new password.
                  </div>

                  <Link to="/login">
                    <Button className="h-14 w-full rounded-2xl bg-emerald-600 text-base font-semibold hover:bg-emerald-700">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              )}

              {step !== "done" && (
                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              © 2024 ResumePro. All rights reserved.{" "}
              <span className="mx-2">•</span> Privacy Policy{" "}
              <span className="mx-2">•</span> Terms of Service
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;