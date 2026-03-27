import { useState } from "react";
import { departments } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadResume = () => {
  const [department, setDepartment] = useState("");
  const [subdepartment, setSubdepartment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const subdepts = departments.find(d => d.name === department)?.subdepartments || [];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!department) e.department = "Required";
    if (!subdepartment) e.subdepartment = "Required";
    if (!name.trim()) e.name = "Required";
    if (!email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (!experience) e.experience = "Required";
    if (!file) e.file = "Please upload a resume";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    toast({ title: "Resume Uploaded!", description: `${name}'s resume has been submitted.` });
    setSubmitted(true);
  };

  const handleReset = () => {
    setDepartment(""); setSubdepartment(""); setName(""); setEmail("");
    setExperience(""); setFile(null); setErrors({}); setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-foreground mb-2">Resume Submitted!</h2>
        <p className="text-muted-foreground mb-8">The resume has been uploaded successfully.</p>
        <Button onClick={handleReset}>Upload Another</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Upload Resume</h1>
        <p className="text-muted-foreground mt-1">Submit a new resume to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 lg:p-8 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={department} onValueChange={v => { setDepartment(v); setSubdepartment(""); }}>
              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {departments.map(d => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
          </div>

          <div className="space-y-2">
            <Label>Subdepartment</Label>
            <Select value={subdepartment} onValueChange={setSubdepartment} disabled={!department}>
              <SelectTrigger><SelectValue placeholder="Select subdepartment" /></SelectTrigger>
              <SelectContent>
                {subdepts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.subdepartment && <p className="text-sm text-destructive">{errors.subdepartment}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience (years)</Label>
          <Input id="experience" type="number" min="0" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 3" />
          {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
        </div>

        <div className="space-y-2">
          <Label>Resume File</Label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">{file ? file.name : "Click to upload or drag & drop"}</span>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files?.[0] || null)} />
          </label>
          {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
        </div>

        <Button type="submit" className="w-full sm:w-auto h-11 px-8">Submit Resume</Button>
      </form>
    </div>
  );
};

export default UploadResume;
