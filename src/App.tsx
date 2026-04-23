


// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { AuthProvider } from "@/contexts/AuthContext";

// import Index from "./pages/Index";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ForgotPassword from "./pages/ForgotPassword";
// import Dashboard from "./pages/Dashboard";
// import Departments from "./pages/Departments";
// import UploadResume from "./pages/UploadResume";
// import Resumes from "./pages/Resumes";
// import Profile from "./pages/Profile";
// import DashboardLayout from "./components/DashboardLayout";
// import NotFound from "./pages/NotFound";
// import History from "./pages/History";
// import Templates from "./pages/Templates";
// import TemplateForm from "./pages/TemplateForm";
// import TemplatePreview from "./pages/ResumePreview";
// import ResumePreview from "./pages/ResumePreview";


// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <BrowserRouter>
//         <AuthProvider>
//           <Routes>
//             <Route path="/" element={<Index />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />

//             <Route
//               path="/dashboard"
//               element={
//                 <DashboardLayout>
//                   <Dashboard />
//                 </DashboardLayout>
                
//               }
//             />
            
//             <Route
//               path="/departments"
//               element={
//                 <DashboardLayout>
//                   <Departments />
//                 </DashboardLayout>
//               }
//             />
//             <Route
//               path="/upload"
//               element={
//                 <DashboardLayout>
//                   <UploadResume />
//                 </DashboardLayout>
//               }
//             />
//             <Route
//               path="/resumes"
//               element={
//                 <DashboardLayout>
//                   <Resumes />
//                 </DashboardLayout>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <DashboardLayout>
//                   <Profile />
//                 </DashboardLayout>
//               }
//             />
//             <Route
//               path="/history"
//               element={
//                 <DashboardLayout>
//                   <History />
//                 </DashboardLayout>
//               }
//             />
//             <Route
//   path="/templates"
//   element={
//     <DashboardLayout>
//       <Templates />
//     </DashboardLayout>
//   }
// />

// <Route
//   path="/templates/:id"
//   element={
//     <DashboardLayout>
//       <TemplateForm />
//     </DashboardLayout>
//   }
// />

// <Route
//   path="/templates/:id/preview"
//   element={
//     <DashboardLayout>
//       <ResumePreview data={{}} />
//     </DashboardLayout>
//   }
// />

//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </AuthProvider>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );


            

// export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import UploadResume from "./pages/UploadResume";
import Resumes from "./pages/Resumes";
import Profile from "./pages/Profile";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import History from "./pages/History";
import Templates from "./pages/Templates";
import TemplateForm from "./pages/TemplateForm";
import Template2Form from "./pages/Template2Form";
import Template3Form from "./pages/Template3Form";
import Template4Form from "./pages/Template4Form";
import TemplatePreview from "./pages/ResumePreview";
import ResumePreview from "./pages/ResumePreview";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/departments"
              element={
                <DashboardLayout>
                  <Departments />
                </DashboardLayout>
              }
            />
            <Route
              path="/upload"
              element={
                <DashboardLayout>
                  <UploadResume />
                </DashboardLayout>
              }
            />
            <Route
              path="/resumes"
              element={
                <DashboardLayout>
                  <Resumes />
                </DashboardLayout>
              }
            />
            {/* <Route
              path="/profile"
              element={
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              }
            /> */}

            <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <Profile />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

            <Route
              path="/history"
              element={
                <DashboardLayout>
                  <History />
                </DashboardLayout>
              }
            />
            <Route
  path="/templates"
  element={
    <DashboardLayout>
      <Templates />
    </DashboardLayout>
  }
/>


<Route
  path="/templates/1"
  element={
    <DashboardLayout>
      <TemplateForm />
    </DashboardLayout>
  }
/>

<Route
  path="/templates/2"
  element={
    <DashboardLayout>
      <Template2Form />
    </DashboardLayout>
  }
/>

<Route
  path="/templates/3"
  element={
    <DashboardLayout>
      <Template3Form />
    </DashboardLayout>
  }
/>

<Route
  path="/templates/4"
  element={
    <DashboardLayout>
      <Template4Form />
    </DashboardLayout>
  }
/>

<Route
  path="/templates/:id/preview"
  element={
    <DashboardLayout>
      <ResumePreview data={{}} />
    </DashboardLayout>
  }
/>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


            

export default App;


