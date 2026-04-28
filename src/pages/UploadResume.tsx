import { useEffect, useState } from "react";
import { API } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  CheckCircle2,
  FileText,
  Briefcase,
  Mail,
  User,
  Sparkles,
} from "lucide-react";

const UploadResume = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [subdepartments, setSubDepartments] = useState<any[]>([]);

  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [subdepartmentId, setSubdepartmentId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dept = await API.get("departments/");
        const sub = await API.get("subdepartments/");
        setDepartments(dept.data);
        setSubDepartments(sub.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredSubDepartments = departmentId
    ? subdepartments.filter((s) => s.department === departmentId)
    : [];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");

    if (!file) {
      setErrorMessage("Please upload a file");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("department", String(departmentId));
      formData.append("subdepartment", String(subdepartmentId));
      formData.append("name", name);
      formData.append("email", email);
      formData.append("skills", skills || "Not provided");
      formData.append("experience", String(experience));
      formData.append("file", file);

      await API.post("resumes/upload/", formData);

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err?.response?.data?.error ||
          JSON.stringify(err?.response?.data) ||
          "Upload failed"
      );
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900">
            Resume Uploaded Successfully!
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Your resume has been added successfully. You can upload another file
            whenever you want.
          </p>

          <Button
            onClick={() => {
              setSubmitted(false);
              setDepartmentId(null);
              setSubdepartmentId(null);
              setName("");
              setEmail("");
              setSkills("");
              setExperience("");
              setFile(null);
              setErrorMessage("");
            }}
            className="mt-8 h-12 rounded-xl bg-[#16a34a] px-6 text-base font-semibold hover:bg-[#15803d]"
          >
            Upload Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Top intro */}
      <div className="rounded-[2rem] border border-green-100 bg-gradient-to-r from-[#eaf8ee] via-[#f4fbf6] to-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm">
          <Sparkles className="h-4 w-4" />
          Resume Upload Portal
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Upload Resume
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Add candidate details, choose department and subdepartment, then upload
          the resume file securely.
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Main form */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Department row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-800">
                Department
              </Label>
              <Select
                value={departmentId ? String(departmentId) : ""}
                onValueChange={(v) => {
                  setDepartmentId(Number(v));
                  setSubdepartmentId(null);
                }}
              >
                <SelectTrigger className="h-14 rounded-xl border-slate-200 text-base">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-800">
                SubDepartment
              </Label>
              <Select
                value={subdepartmentId ? String(subdepartmentId) : ""}
                onValueChange={(v) => setSubdepartmentId(Number(v))}
              >
                <SelectTrigger className="h-14 rounded-xl border-slate-200 text-base">
                  <SelectValue placeholder="Select SubDepartment" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubDepartments.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Basic fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-800">
                Candidate Name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Enter candidate name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 rounded-xl border-slate-200 pl-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-800">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-xl border-slate-200 pl-12 text-base"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-800">
                Skills
              </Label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Enter skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="h-14 rounded-xl border-slate-200 pl-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-800">
                Experience
              </Label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="h-14 rounded-xl border-slate-200 pl-12 text-base"
                />
              </div>
            </div>
          </div>

          {/* File upload */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-800">
              Resume File
            </Label>

            <label className="block cursor-pointer rounded-[1.5rem] border-2 border-dashed border-green-200 bg-green-50/40 p-8 transition hover:border-green-400 hover:bg-green-50">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-green-600 shadow-sm">
                  <Upload className="h-8 w-8" />
                </div>

                <p className="text-base font-semibold text-slate-800">
                  {file ? file.name : "Click to upload resume"}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Upload PDF, DOC, or DOCX resume file
                </p>
              </div>

              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="h-12 rounded-xl bg-[#16a34a] px-8 text-base font-semibold hover:bg-[#15803d]"
            >
              Upload Resume
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;

