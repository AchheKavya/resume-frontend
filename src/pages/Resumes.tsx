

import { useEffect, useState } from "react";
import { API } from "@/services/api";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { FileText, Download, Eye, Trash2, Bookmark } from "lucide-react";

interface ResumeRow {
  id: number;
  name: string;
  email: string;
  department: number;
  subdepartment: number;
  skills: string;
  experience: number;
  file: string;
  uploaded_at: string;
  is_bookmarked: boolean;
}

const Resumes = () => {
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const [departments, setDepartments] = useState<any[]>([]);
  const [subdepartments, setSubdepartments] = useState<any[]>([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSubDept, setSelectedSubDept] = useState("");

  const [initialized, setInitialized] = useState(false);

  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // ✅ READ URL PARAMS
  useEffect(() => {
    const dept = searchParams.get("department");
    const sub = searchParams.get("subdepartment");

    setSelectedDept(dept || "");
    setSelectedSubDept(sub || "");

    setInitialized(true);
  }, [searchParams]);

  // ✅ LOAD RESUMES
  const loadResumes = async (searchValue = "") => {
    try {
      setLoading(true);

      const params: any = {};

      if (searchValue) params.search = searchValue;
      if (selectedDept) params.department = selectedDept;
      if (selectedSubDept) params.subdepartment = selectedSubDept;

      const { data } = await API.get("resumes/", { params });

      // 🔥 SORT HERE (IMPORTANT FIX)
      const sorted = [...data].sort((a, b) => {
        if (a.is_bookmarked === b.is_bookmarked) {
          return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
        }
        return a.is_bookmarked ? -1 : 1;
      });

      setResumes(sorted);

    } catch (e) {
      setError("Unable to load resumes.");
      toast({ title: "Error", description: "Failed to load resumes" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ DEBOUNCE SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(inputValue);
    }, 500);

    return () => clearTimeout(delay);
  }, [inputValue]);

  // ✅ MAIN TRIGGER
  useEffect(() => {
    if (!initialized) return;
    loadResumes(search);
  }, [search, selectedDept, selectedSubDept, initialized]);

  // ✅ FETCH FILTERS
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const deptRes = await API.get("departments/");
        const subDeptRes = await API.get("subdepartments/");
        setDepartments(deptRes.data);
        setSubdepartments(subDeptRes.data);
      } catch {
        console.error("Failed to load filters");
      }
    };

    fetchFilters();
  }, []);

  // ✅ BOOKMARK (NO RELOAD, NO FILTER BREAK)
  const toggleBookmark = async (id: number) => {
    try {
      const res = await API.post(`/resumes/${id}/bookmark/`);

      setResumes((prev) => {
        const updated = prev.map((r) =>
          r.id === id
            ? { ...r, is_bookmarked: res.data.is_bookmarked }
            : r
        );

        // SORT AFTER UPDATE
        return [...updated].sort((a, b) => {
          if (a.is_bookmarked === b.is_bookmarked) {
            return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
          }
          return a.is_bookmarked ? -1 : 1;
        });
      });

    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update bookmark" });
    }
  };

  // ACTIONS
  const downloadResume = (id: number) => {
    const backend = import.meta.env.VITE_BACKEND_URL || "https://resume-project-b.onrender.com";
    window.open(`${backend}/api/resumes/download/${id}/`, "_blank");
  };

  const viewResume = (fileUrl: string) => {
    const backend = import.meta.env.VITE_BACKEND_URL || "https://resume-project-b.onrender.com";
    const fullUrl = fileUrl.startsWith("http") ? fileUrl : `${backend}${fileUrl}`;
    window.open(fullUrl, "_blank");
  };

  const deleteResume = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await API.delete(`resumes/delete/${id}/`);
      setResumes((prev) => prev.filter((r) => r.id !== id));

      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Error",
        description: "Failed to delete resume",
      });
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="space-y-4">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">All Resumes</h1>
        <p>{resumes.length} results</p>
      </div>

      <input
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border px-3 py-2 rounded-md"
      />

      <div className="flex gap-4">

        <select
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setSelectedSubDept("");
          }}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          value={selectedSubDept}
          onChange={(e) => setSelectedSubDept(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">All SubDepartments</option>
          {subdepartments
            .filter((s) => !selectedDept || s.department === Number(selectedDept))
            .map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
        </select>

      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="mx-auto mb-2 opacity-50" />
          <p>No resumes found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {resumes.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.experience} yrs</TableCell>
                <TableCell>{r.skills}</TableCell>

                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => viewResume(r.file)}>
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button size="icon" variant="ghost" onClick={() => downloadResume(r.id)}>
                    <Download className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleBookmark(r.id)}
                    className={r.is_bookmarked ? "text-yellow-500" : "text-gray-400"}
                  >
                    <Bookmark className={r.is_bookmarked ? "fill-yellow-400" : ""} />
                  </Button>

                  <Button size="icon" variant="ghost" onClick={() => deleteResume(r.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Resumes;

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { Sparkles, FileText, ArrowRight } from "lucide-react";

// import template1 from "@/assets/template1.png";
// import template2 from "@/assets/template2.png";
// import template3 from "@/assets/template3.png";
// import template4 from "@/assets/template4.png";

// const templates = [
//   {
//     id: 1,
//     name: "Professional",
//     description: "Clean and modern",
//     image: template1,
//   },
//   {
//     id: 2,
//     name: "Modern",
//     description: "Dark header style",
//     image: template2,
//   },
//   {
//     id: 3,
//     name: "Minimal",
//     description: "Simple clean layout",
//     image: template3,
//   },
//   {
//     id: 4,
//     name: "Creative",
//     description: "Colorful design",
//     image: template4,
//   },
// ];

// const Templates = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="space-y-8">
//       {/* Top Header */}
//       <div className="rounded-[2rem] border border-green-100 bg-gradient-to-r from-[#eaf8ee] via-[#f4fbf6] to-white p-6 shadow-sm sm:p-8">
//         <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm">
//           <Sparkles className="h-4 w-4" />
//           Resume Design Studio
//         </div>

//         <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
//               Resume Templates
//             </h1>
//             <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
//               Choose a template style to create a professional resume that
//               matches your profile and career goals.
//             </p>
//           </div>

//           <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
//             <p className="text-xs uppercase tracking-wide text-slate-500">
//               Available Templates
//             </p>
//             <h2 className="mt-1 text-3xl font-bold text-slate-900">
//               {templates.length}
//             </h2>
//           </div>
//         </div>
//       </div>

//       {/* Template Grid */}
//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
//         {templates.map((template) => (
//           <Card
//             key={template.id}
//             className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//           >
//             <div className="relative overflow-hidden bg-slate-50">
//               <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
//                 <FileText className="h-3.5 w-3.5" />
//                 Template {template.id}
//               </div>

//               <img
//                 src={template.image}
//                 alt={template.name}
//                 className="h-72 w-full object-contain bg-white p-4 transition duration-300 group-hover:scale-[1.02]"
//               />
//             </div>

//             <CardContent className="space-y-4 p-5">
//               <div>
//                 <h3 className="text-xl font-bold text-slate-900">
//                   {template.name}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {template.description}
//                 </p>
//               </div>

//               <Button
//                 className="h-11 w-full rounded-xl bg-[#16a34a] font-semibold hover:bg-[#15803d]"
//                 onClick={() => navigate(`/templates/${template.id}`)}
//               >
//                 Use Template
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Templates;
