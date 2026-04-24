import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  Code, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronDown,
  FileText,
  Download,
  Loader2
} from 'lucide-react';

/**
 * Modern Resume Builder
 * Features: Real-time editing and High-quality PDF Export.
 * Note: Libraries loaded via script injection to ensure preview compatibility.
 */

// --- SUB-COMPONENTS ---

const SectionHeader = ({ icon: Icon, title, isOpen, onToggle }) => (
  <button 
    onClick={onToggle}
    className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-t-xl hover:bg-slate-50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/10 text-primary rounded-lg">
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

const InputField = ({ label, placeholder, value, onChange, type = "text", isTextArea = false }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{label}</label>
    {isTextArea ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[100px] text-sm text-slate-700 bg-slate-50/50"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-700 bg-slate-50/50"
      />
    )}
  </div>
);

// --- MAIN APP ---

export default function App() {
  const resumeRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);

  const [form, setForm] = useState({
  full_name: "sria",
  email: "sria@example.com",
  phone: "+1 234 567 890",
  location: "New York, NY",
  linkedin: "",
  github: "",
  summary: "Detail-oriented software engineer with a focus on building accessible and scalable web applications.",

  skills: [{ name: "React" }, { name: "TypeScript" }, { name: "Tailwind CSS" }],
  experiences: [{ job_title: "Senior Developer", company: "Tech Corp", period: "2020 - Present", desc: "Leading the frontend team." }],

  //  ADD THESE
  educations: [],
  projects: [],
  customSections: []
});

  const [activeSections, setActiveSections] = useState({
    basic: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    custom: true
  });

  // Load PDF libraries dynamically for environment compatibility
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
    ]).then(() => {
      setLibsLoaded(true);
    });
  }, []);

  const toggleSection = (sect) => setActiveSections(prev => ({ ...prev, [sect]: !prev[sect] }));

  const addItem = (field, obj) => setForm(prev => ({ ...prev, [field]: [...prev[field], obj] }));
  const removeItem = (field, index) => {
    const updated = [...form[field]];
    updated.splice(index, 1);
    setForm({ ...form, [field]: updated });
  };
  const handleArrayChange = (field, index, key, value) => {
    const updated = [...form[field]];
    updated[index][key] = value;
    setForm({ ...form, [field]: updated });
  };


  // ✅ CUSTOM SECTIONS

const addCustomSection = () => {
  setForm(prev => ({
    ...prev,
    customSections: [
      ...prev.customSections,
      { title: "New Section", items: [""] }
    ]
  }));
};

const addCustomItem = (sectionIndex) => {
  const updated = [...form.customSections];
  updated[sectionIndex].items.push("");
  setForm({ ...form, customSections: updated });
};

const handleCustomChange = (sectionIndex, itemIndex, value) => {
  const updated = [...form.customSections];
  updated[sectionIndex].items[itemIndex] = value;
  setForm({ ...form, customSections: updated });
};

  const downloadPDF = async () => {
    if (!resumeRef.current || !libsLoaded) return;
    setIsDownloading(true);

    try {
      const { jsPDF } = window.jspdf;
      const html2canvas = window.html2canvas;
      const element = resumeRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${form.full_name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* LEFT SIDE: THE FORM */}
      <div className="w-full md:w-[450px] lg:w-[550px] h-full bg-white shadow-xl flex flex-col z-10">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-600 rounded-lg text-white">
              <FileText size={20} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">RESUMAKE</h1>
          </div>
          <div className="flex gap-2">
            <button 
               onClick={downloadPDF}
               disabled={isDownloading || !libsLoaded}
               className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-200"
            >
              {isDownloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {isDownloading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <SectionHeader icon={User} title="Basic Information" isOpen={activeSections.basic} onToggle={() => toggleSection('basic')} />
            {activeSections.basic && (
              <div className="p-5 border border-t-0 border-slate-200 rounded-b-xl bg-white space-y-4 shadow-sm">
                <InputField label="Full Name" placeholder="Jane Doe" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Email" placeholder="jane@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  <InputField label="Phone" placeholder="+1 234..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <InputField label="Location" placeholder="San Francisco, CA" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                <InputField
  label="LinkedIn"
  placeholder="https://linkedin.com/in/yourname"
  value={form.linkedin}
  onChange={(e) =>
    setForm({ ...form, linkedin: e.target.value })
  }
/>

<InputField
  label="GitHub"
  placeholder="https://github.com/yourname"
  value={form.github}
  onChange={(e) =>
    setForm({ ...form, github: e.target.value })
  }
/>
                <InputField label="Professional Summary" isTextArea placeholder="Describe your career goals..." value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <SectionHeader icon={Briefcase} title="Experience" isOpen={activeSections.experience} onToggle={() => toggleSection('experience')} />
            {activeSections.experience && (
              <div className="p-5 border border-t-0 border-slate-200 rounded-b-xl bg-white space-y-6">
                {form.experiences.map((exp, i) => (
                  <div key={i} className="relative p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-3 group">
                    <button onClick={() => removeItem("experiences", i)} className="absolute -top-2 -right-2 p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Job Title" value={exp.job_title} onChange={e => handleArrayChange("experiences", i, "job_title", e.target.value)} />
                      <InputField label="Company" value={exp.company} onChange={e => handleArrayChange("experiences", i, "company", e.target.value)} />
                    </div>
                    <InputField label="Period" placeholder="2020 - Present" value={exp.period} onChange={e => handleArrayChange("experiences", i, "period", e.target.value)} />
                  </div>
                ))}
                <button 
                  onClick={() => addItem("experiences", { job_title: "", company: "", period: "", desc: "" })}
                  className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-green-600 border-2 border-dashed border-green-100 rounded-xl hover:bg-green-50 transition-all"
                >
                  <Plus size={16} /> Add Experience
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <SectionHeader icon={Code} title="Skills" isOpen={activeSections.skills} onToggle={() => toggleSection('skills')} />
            {activeSections.skills && (
              <div className="p-5 border border-t-0 border-slate-200 rounded-b-xl bg-white space-y-4">
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg border border-slate-200">
                      <input 
                        className="bg-transparent text-sm font-medium outline-none w-24"
                        value={s.name}
                        onChange={e => handleArrayChange("skills", i, "name", e.target.value)}
                      />
                      <button onClick={() => removeItem("skills", i)} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => addItem("skills", { name: "" })}
                  className="w-full py-2 text-sm font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> New Skill
                </button>
              </div>
            )}
          </div>
          <div className="space-y-4">
  <SectionHeader
    icon={User}
    title="Education"
    isOpen={activeSections.education}
    onToggle={() => toggleSection('education')}
  />

  {activeSections.education && (
    <div className="p-5 border border-t-0 border-slate-200 rounded-b-xl bg-white space-y-6">

      {(form.educations || []).map((edu, i) => (
        <div key={i} className="relative p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-3">

          <button
            onClick={() => removeItem("educations", i)}
            className="absolute -top-2 -right-2 p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={14} />
          </button>

          <InputField
            label="Degree"
            value={edu.degree}
            onChange={(e) =>
              handleArrayChange("educations", i, "degree", e.target.value)
            }
          />

          <InputField
            label="Institution"
            value={edu.institution}
            onChange={(e) =>
              handleArrayChange("educations", i, "institution", e.target.value)
            }
          />

          <InputField
            label="Period"
            value={edu.period}
            onChange={(e) =>
              handleArrayChange("educations", i, "period", e.target.value)
            }
          />
        </div>
      ))}

      <button
        onClick={() =>
          addItem("educations", {
            degree: "",
            institution: "",
            period: ""
          })
        }
        className="w-full py-3 text-sm font-bold text-blue-600 border-2 border-dashed border-blue-100 rounded-xl"
      >
        + Add Education
      </button>
    </div>
  )}
</div>

<div className="space-y-4">
  <SectionHeader
    icon={Code}
    title="Projects"
    isOpen={activeSections.projects}
    onToggle={() => toggleSection('projects')}
  />

  {activeSections.projects && (
    <div className="p-5 border border-t-0 border-slate-200 rounded-b-xl bg-white space-y-6">

      {(form.projects || []).map((p, i) => (
        <div key={i} className="relative p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-3">

          <button
            onClick={() => removeItem("projects", i)}
            className="absolute -top-2 -right-2 p-1.5 bg-red-50 text-red-500 rounded-full"
          >
            <Trash2 size={14} />
          </button>

          <InputField
            label="Project Title"
            value={p.title}
            onChange={(e) =>
              handleArrayChange("projects", i, "title", e.target.value)
            }
          />

          <InputField
  label="Technologies Used"
  placeholder="React, Django"
  value={p.technologies}
  onChange={(e) =>
    handleArrayChange("projects", i, "technologies", e.target.value)
  }
/>

<InputField
  label="Project Duration"
  placeholder="Jan 2024 - Mar 2024"
  value={p.period}
  onChange={(e) =>
    handleArrayChange("projects", i, "period", e.target.value)
  }
/>

<InputField
  label="Project Link"
  placeholder="https://yourproject.com"
  value={p.link}
  onChange={(e) =>
    handleArrayChange("projects", i, "link", e.target.value)
  }
/>
          <InputField
            label="Description"
            placeholder="jan 2025 -mar 2025"
            value={p.description}
            onChange={(e) =>
              handleArrayChange("projects", i, "description", e.target.value)
            }
          />
        </div>
      ))}

      <button
        onClick={() =>
          addItem("projects", { title: "", description: "" ,technologies:"",period:"",link:""})
        }
        className="w-full py-3 text-sm font-bold text-blue-600 border-2 border-dashed border-blue-100 rounded-xl"
      >
        + Add Project
      </button>
    </div>
  )}
</div>

<div className="space-y-4">
  <SectionHeader
    icon={FileText}
    title="Custom Sections"
    isOpen={activeSections.custom}
    onToggle={() => toggleSection('custom')}
  />

  {activeSections.custom && (
    <div className="p-5 border border-t-0 border-slate-200 rounded-b-xl bg-white space-y-6">

      {(form.customSections || []).map((section, i) => (
        <div key={i} className="space-y-3 border p-3 rounded-lg">

          <InputField
            label="Section Title"
            value={section.title}
            onChange={(e) => {
              const updated = [...form.customSections];
              updated[i].title = e.target.value;
              setForm({ ...form, customSections: updated });
            }}
          />

          {section.items.map((item, j) => (
            <InputField
              key={j}
              label={`Item ${j + 1}`}
              value={item}
              onChange={(e) =>
                handleCustomChange(i, j, e.target.value)
              }
            />
          ))}

          <button
            onClick={() => addCustomItem(i)}
            className="text-blue-600 text-sm"
          >
            + Add Item
          </button>
        </div>
      ))}

      <button
        onClick={addCustomSection}
        className="w-full py-3 text-sm font-bold text-blue-600 border-2 border-dashed border-blue-100 rounded-xl"
      >
        + Add Section
      </button>
    </div>
  )}
</div>

        </div>
      </div>

   {/* RIGHT SIDE: THE PREVIEW */}
<div className="hidden md:flex flex-1 bg-slate-200 p-10 overflow-y-auto justify-center">
  <div
    ref={resumeRef}
    className="w-[210mm] min-h-[297mm] h-fit bg-white shadow-2xl p-16 flex flex-col gap-8 text-slate-800"
  >

    {/* HEADER */}
    <div className="border-b-4 border-slate-800 pb-8">
      <h1 className="text-5xl font-black uppercase mb-2">
        {form.full_name || "Your Name"}
      </h1>

      <div className="flex gap-4 text-slate-500">
        {form.email && <span>{form.email}</span>}
        {form.phone && <span>{form.phone}</span>}
        {form.location && <span>{form.location}</span>}
        {form.linkedin && (
    <a href={form.linkedin} target="_blank" className="text-blue-600 underline">
      {form.linkedin}
    </a>
  )}

  {form.github && (
    <a href={form.github} target="_blank" className="text-blue-600 underline">
      {form.github}
    </a>
  )}
      </div>
    </div>

    {/* SUMMARY */}
    {form.summary && (
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-bold text-blue-600 uppercase">Summary</h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <p className="text-sm">{form.summary}</p>
      </section>
    )}

    {/* EDUCATION */}
    {form.educations?.length > 0 && (
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-bold text-blue-600 uppercase">Education</h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {form.educations.map((edu, i) => (
          <div key={i} className="flex justify-between mb-2">

            {/* LEFT */}
            <p className="font-semibold">
              {edu.degree} — <span className="text-blue-600">{edu.institution}</span>
            </p>

            {/* RIGHT */}
            <p className="text-sm text-gray-500">
              {edu.period}
            </p>

          </div>
        ))}
      </section>
    )}

    {/* SKILLS */}
    {form.skills?.length > 0 && (
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-bold text-blue-600 uppercase">Skills</h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="flex flex-wrap gap-2">
          {form.skills.map((s, i) => (
            <span key={i} className="px-2 py-1 border text-xs rounded">
              {s.name}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* INTERNSHIPS */}
    {form.internships?.length > 0 && (
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-bold text-blue-600 uppercase">Internships</h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {form.internships.map((int, i) => (
          <div key={i} className="flex justify-between mb-2">
            <p className="font-semibold">
              {int.role} — <span className="text-blue-600">{int.company}</span>
            </p>
            <p className="text-sm text-gray-500">{int.period}</p>
          </div>
        ))}
      </section>
    )}


      {form.projects?.length > 0 && (
  <section>
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-sm font-bold text-blue-600 uppercase">
        Projects
      </h2>
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>

    {form.projects.map((p, i) => (
      <div key={i} className="mb-4">

        {/* TITLE */}
        <p className="font-semibold text-slate-900">
          {p.title}
        </p>

        {/* TECH + PERIOD (ONLY IF EXISTS) */}
        {(p.technologies || p.period) && (
          <div className="text-sm mt-1 flex items-center gap-2">

            {/* TECH (ONLY IF EXISTS) */}
            {p.technologies && (
              <p className="text-blue-600">
                tech used : {p.technologies}
              </p>
            )}

            {/* PERIOD (ONLY IF EXISTS) */}
            {p.period && (
              <p className="text-gray-500">
                ({p.period})
              </p>
            )}

          </div>
        )}

        {p.link && (
  <a
    href={p.link}
    target="_blank"
    className="text-blue-600 text-sm underline"
  >
    {p.link}
  </a>
)}

        {/* DESCRIPTION */}
        {p.description && (
          <p className="text-sm text-gray-600 mt-1">
            {p.description && (
  <ul className="list-disc ml-5 mt-1 text-sm text-gray-600 space-y-1">
    {p.description
      .split(/\n|\.\s+/) // split by ENTER or ". "
      .filter(line => line.trim() !== "")
      .map((line, index) => (
        <li key={index}>
          {line.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "")}
        </li>
      ))}
  </ul>
)}
          </p>
        )}

      </div>
    ))}
  </section>
)}

    {/* CUSTOM */}
    {form.customSections?.length > 0 && (
      <section>
        {form.customSections.map((section, i) => (
          <div key={i} className="mb-4">

            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-bold text-blue-600 uppercase">
                {section.title}
              </h2>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {section.items.map((item, j) => (
              <p key={j}>• {item}</p>
            ))}
          </div>
        ))}
      </section>
    )}

    {/* EXPERIENCE (LAST) */}
    {form.experiences?.length > 0 && (
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-bold text-blue-600 uppercase">Experience</h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {form.experiences.map((exp, i) => (
          <div key={i} className="flex justify-between mb-2">
            <p className="font-semibold">
              {exp.job_title} — <span className="text-blue-600">{exp.company}</span>
            </p>
            <p className="text-sm text-gray-500">{exp.period}</p>
          </div>
        ))}
      </section>
    )}

  </div>
</div>
</div>

  );
};

