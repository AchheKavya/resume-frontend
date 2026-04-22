

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { UserPlus } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import GoogleSignIn from "@/components/GoogleSignIn";

// const Signup = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const { signup } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!username.trim()) e.username = "Username is required";
//     if (!email.trim()) e.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email format";
//     if (!password) e.password = "Password is required";
//     else if (password.length < 6) e.password = "Password must be at least 6 characters";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = (ev: React.FormEvent) => {
//     ev.preventDefault();
//     if (!validate()) return;
//     signup(username, email, password);
//     toast({ title: "Account created!", description: "Welcome to ResumeHub." });
//     navigate("/dashboard");
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
//             <UserPlus className="w-7 h-7 text-primary" />
//           </div>
//           <h1 className="text-2xl font-bold font-heading text-foreground">
//             Create account
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Get started with ResumeHub
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="space-y-2">
//             <Label htmlFor="username">Username</Label>
//             <Input
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Choose a username"
//             />
//             {errors.username && (
//               <p className="text-sm text-destructive">{errors.username}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="your@email.com"
//             />
//             {errors.email && (
//               <p className="text-sm text-destructive">{errors.email}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Min 6 characters"
//             />
//             {errors.password && (
//               <p className="text-sm text-destructive">{errors.password}</p>
//             )}
//           </div>

//           <Button
//             type="submit"
//             className="w-full h-11 text-base font-medium"
//           >
//             Create Account
//           </Button>
//         </form>

//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-border" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-card px-3 text-muted-foreground">
//               or continue with
//             </span>
//           </div>
//         </div>

//         {/* ✅ GOOGLE SIGNUP FIX */}
//         <GoogleSignIn />

//         <p className="text-center text-sm text-muted-foreground mt-6">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-primary font-medium hover:underline"
//           >
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;


// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { UserPlus } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import GoogleSignIn from "@/components/GoogleSignIn";

// const Signup = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const { signup } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!username.trim()) e.username = "Username is required";
//     if (!email.trim()) e.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
//       e.email = "Invalid email format";
//     if (!password) e.password = "Password is required";
//     else if (password.length < 6)
//       e.password = "Password must be at least 6 characters";

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (ev: React.FormEvent) => {
//     ev.preventDefault();

//     if (!validate()) return;

//     try {
//       // 🔥 WAIT for backend response
//       const res = await signup(username, email, password);

//       console.log("Signup Response:", res);

//       toast({
//         title: "Account created!",
//         description: "Welcome to ResumeHub.",
//       });

//       // ✅ redirect to login (safe flow)
//       navigate("/login");

//     } catch (err: any) {
//       console.error("Signup Error:", err);

//       let message = "Signup failed. Try again.";

//       if (err.response?.data) {
//         const data = err.response.data;

//         if (data.username) message = data.username[0];
//         else if (data.email) message = data.email[0];
//         else if (data.password) message = data.password[0];
//       }

//       toast({
//         title: "Error",
//         description: message,
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
//             <UserPlus className="w-7 h-7 text-primary" />
//           </div>
//           <h1 className="text-2xl font-bold font-heading text-foreground">
//             Create account
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Get started with ResumeHub
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="space-y-2">
//             <Label htmlFor="username">Username</Label>
//             <Input
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Choose a username"
//             />
//             {errors.username && (
//               <p className="text-sm text-destructive">{errors.username}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="your@email.com"
//             />
//             {errors.email && (
//               <p className="text-sm text-destructive">{errors.email}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Min 6 characters"
//             />
//             {errors.password && (
//               <p className="text-sm text-destructive">{errors.password}</p>
//             )}
//           </div>

//           <Button type="submit" className="w-full h-11 text-base font-medium">
//             Create Account
//           </Button>
//         </form>

//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-border" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-card px-3 text-muted-foreground">
//               or continue with
//             </span>
//           </div>
//         </div>

//         {/* GOOGLE SIGNIN */}
//         <GoogleSignIn />

//         <p className="text-center text-sm text-muted-foreground mt-6">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-primary font-medium hover:underline"
//           >
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import GoogleSignIn from "@/components/GoogleSignIn";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  Sparkles,
  Trophy,
  User,
  UserPlus,
} from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = "Username is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Invalid email format";
    }
    if (!password) e.password = "Password is required";
    else if (password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // const handleSubmit = async (ev: React.FormEvent) => {
  //   ev.preventDefault();

  //   if (!validate()) return;

  //   try {
  //     const res = await signup(username, email, password);
  //     console.log("Signup Response:", res);

  //     toast({
  //       title: "Account created!",
  //       description: "Welcome to ResumeHub.",
  //     });

  //     navigate("/login");
  //   } catch (err: any) {
  //     console.error("Signup Error:", err);

  //     let message = "Signup failed. Try again.";

  //     if (err.response?.data) {
  //       const data = err.response.data;

  //       if (data.username) message = data.username[0];
  //       else if (data.email) message = data.email[0];
  //       else if (data.password) message = data.password[0];
  //       else if (data.detail) message = data.detail;
  //     }

  //     toast({
  //       title: "Error",
  //       description: message,
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleSubmit = async (ev: React.FormEvent) => {
  ev.preventDefault();
  console.log("STEP A: form submitted");

  if (!validate()) {
    console.log("STEP B: validation failed");
    return;
  }

  console.log("STEP C: calling signup");

  try {
    const res = await signup(username, email, password);
    console.log("STEP D: signup done", res);

    toast({
      title: "Account created!",
      description: "Welcome to ResumeHub.",
    });

    navigate("/login");
  } catch (err: any) {
    console.error("Signup Error:", err);

    let message = "Signup failed. Try again.";

    if (err.response?.data) {
      const data = err.response.data;

      if (data.username) message = data.username[0];
      else if (data.email) message = data.email[0];
      else if (data.password) message = data.password[0];
      else if (data.detail) message = data.detail;
    }

    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen bg-[#f6f8f7] flex flex-col">
      <div className="flex-1 grid lg:grid-cols-2">
        <div className="relative hidden lg:flex overflow-hidden bg-gradient-to-br from-[#edf9f1] via-[#dcf5e7] to-[#f8fbf9]">
          <div className="absolute inset-0">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#22c55e]/10 blur-3xl" />
            <div className="absolute top-32 left-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
            <div className="absolute bottom-20 right-10 h-56 w-56 rounded-full bg-[#16a34a]/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex h-full w-full flex-col justify-between px-10 py-10 xl:px-16">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16a34a] text-white shadow-lg shadow-green-200">
                <FileText className="h-7 w-7" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Resume<span className="text-[#16a34a]">Pro</span>
              </h1>
            </div>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[#16a34a] shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                <span className="text-lg font-semibold">Join Us Today!</span>
              </div>

              <h2 className="text-6xl font-extrabold leading-[1.05] text-slate-900">
                Build Your <br />
                <span className="text-[#16a34a]">Career Future</span>
              </h2>

              <p className="mt-6 max-w-lg text-2xl leading-relaxed text-slate-600">
                Create your account and unlock powerful resume tools to grow your
                professional journey.
              </p>

              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#16a34a] shadow-md">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      Create Smart Resumes
                    </h3>
                    <p className="mt-1 text-xl text-slate-600">
                      Professional and ATS-friendly templates
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#16a34a] shadow-md">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      Manage Everything
                    </h3>
                    <p className="mt-1 text-xl text-slate-600">
                      Track resumes, uploads, and applications easily
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#16a34a] shadow-md">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      Grow Faster
                    </h3>
                    <p className="mt-1 text-xl text-slate-600">
                      Take the next step toward your dream job
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-10 h-[280px] w-full">
              <div className="absolute bottom-0 left-0 right-0 h-20 rounded-t-[2rem] bg-white/55 backdrop-blur-sm" />
            </div>
          </div>
        </div>

        <div className="flex min-h-screen flex-col bg-[#f8f8f8]">
          <div className="flex items-center justify-between px-6 py-6 lg:px-10">
            <Link to="/" className="flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16a34a] text-white shadow-md">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Resume<span className="text-[#16a34a]">Pro</span>
              </h1>
            </Link>

            <div className="ml-auto flex items-center gap-8 text-lg">
              <Link
                to="/login"
                className="pb-1 font-medium text-slate-500 transition hover:text-slate-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="border-b-2 border-[#16a34a] pb-1 font-semibold text-[#16a34a]"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
            <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200/80 bg-white px-6 py-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              <div className="mx-auto max-w-lg">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[#dcfce7] text-[#16a34a]">
                    <UserPlus className="h-10 w-10" />
                  </div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                    Create Account
                  </h2>
                  <p className="mt-3 text-xl text-slate-500">
                    Get started with ResumeHub
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="username" className="text-base font-semibold text-slate-800">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        className="h-14 rounded-xl border-slate-200 pl-12 pr-4 text-base shadow-sm focus-visible:ring-[#16a34a]"
                      />
                    </div>
                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-base font-semibold text-slate-800">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-14 rounded-xl border-slate-200 pl-12 pr-4 text-base shadow-sm focus-visible:ring-[#16a34a]"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="password" className="text-base font-semibold text-slate-800">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="h-14 rounded-xl border-slate-200 pl-12 pr-14 text-base shadow-sm focus-visible:ring-[#16a34a]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="h-14 w-full rounded-xl bg-[#16a34a] text-lg font-semibold text-white hover:bg-[#15803d]"
                  >
                    <span>Create Account</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-slate-400">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <GoogleSignIn />
                </div>

                <p className="mt-8 text-center text-base text-slate-600">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-[#16a34a] hover:underline">
                    Sign In
                  </Link>
                </p>

                <div className="mt-8 flex justify-center lg:hidden">
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-[#16a34a]">
                    <BadgeCheck className="h-4 w-4" />
                    Start building your profile securely
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 px-4 py-5 text-center text-sm text-slate-500 sm:px-8">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
              <span>© 2024 ResumePro. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span>Privacy Policy</span>
              <span className="hidden sm:inline">•</span>
              <span>Terms of Service</span>
              <span className="hidden sm:inline">•</span>
              <span>Help Center</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;