import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, User, Briefcase, Code, Mail, Phone, 
  ChevronDown, FileText, Download, Loader2, Github, Linkedin, 
  GraduationCap, Link as LinkIcon, Award, Globe, MessageSquare, Layers
} from 'lucide-react';

// --- SHARED UI COMPONENTS ---

const SectionHeader = ({ icon: Icon, title, isOpen, onToggle }) => (
  <button 
    onClick={onToggle}
    className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-t-xl hover:bg-slate-50 transition-colors mt-2"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

const InputField = ({ label, placeholder, value, onChange, type = "text", isTextArea = false }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">{label}</label>
    {isTextArea ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] text-sm text-slate-700 bg-white"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-700 bg-white"
      />
    )}
  </div>
);

export default function App() {
  const resumeRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);
  // CHANGED: Default themeColor set to black (#111827)
  const [themeColor, setThemeColor] = useState('#111827'); 

  const [form, setForm] = useState({
    full_name: "Srinadh Yalagandula",
    tagline: "Python Developer & Full Stack Enthusiast",
    email: "srinadh1122@gmail.com",
    phone: "9876543210",
    linkedin: "linkedin.com/in/srinadh",
    github: "github.com/srinadh",
    summary: "Motivated Python Developer with experience in Django and REST APIs. Passionate about building scalable web applications and solving complex problems with clean code.",
    skills: [
      { category: "Languages", names: "Python, JavaScript, SQL" },
      { category: "Frameworks", names: "Django, React, Tailwind CSS" }
    ],
    softSkills: "Communication, Problem-solving, Teamwork, Time management",
    educations: [
      { degree: "B.Tech in Computer Science", institution: "XYZ College of Engineering", period: "2022-2026", score: "9.2 CGPA" },
      { degree: "Intermediate (MPC)", institution: "ABC Junior College", period: "2020-2022", score: "97%" }
    ],
    projects: [
      { 
        title: "Resume Management System", 
        tech: "Django, React, SQLite", 
        desc: "A platform for HR teams to filter and manage candidate resumes efficiently.",
        features: "Automated parsing, status tracking, email notifications",
        role: "Lead Backend Developer",
        link: "github.com/kavya/resume-sys"
      }
    ],
    experience: [
      { company: "Tech Solutions Inc.", role: "Web Development Intern", period: "June 2023 - Aug 2023", desc: "Worked on UI components using React and integrated REST APIs.", tech: "React, Node.js" }
    ],
    customSections: [
      { title: "Awards & Achievements", items: ["Winner of Tech-Hacks 2023", "Certified Cloud Practitioner"] }
    ]
  });

  const [activeSections, setActiveSections] = useState({
    basic: true, skills: true, education: true, projects: true, experience: true, custom: true
  });

  useEffect(() => {
    const loadScript = (src) => new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src; script.onload = resolve;
      document.head.appendChild(script);
    });
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
    ]).then(() => setLibsLoaded(true));
  }, []);

  const toggleSection = (sect) => setActiveSections(prev => ({ ...prev, [sect]: !prev[sect] }));
  const addItem = (field, obj) => setForm(p => ({ ...p, [field]: [...p[field], obj] }));
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

  // --- CUSTOM SECTION HANDLERS ---
  const addCustomSection = () => {
    setForm(p => ({ ...p, customSections: [...p.customSections, { title: "New Section", items: [""] }] }));
  };
  const addCustomItem = (sIdx) => {
    const updated = [...form.customSections];
    updated[sIdx].items.push("");
    setForm({ ...form, customSections: updated });
  };
  const handleCustomItemChange = (sIdx, iIdx, value) => {
    const updated = [...form.customSections];
    updated[sIdx].items[iIdx] = value;
    setForm({ ...form, customSections: updated });
  };
  const removeCustomItem = (sIdx, iIdx) => {
    const updated = [...form.customSections];
    updated[sIdx].items.splice(iIdx, 1);
    setForm({ ...form, customSections: updated });
  };

  const downloadPDF = async () => {
    if (!resumeRef.current || !libsLoaded) return;
    setIsDownloading(true);
    try {
      const canvas = await window.html2canvas(resumeRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${form.full_name.replace(/\s+/g, '_')}_Resume.pdf`);
    } finally { setIsDownloading(false); }
  };

  return (
    <div className="flex h-screen bg-slate-200 overflow-hidden font-sans">
      
      {/* EDITOR SIDEBAR */}
      <div className="w-[450px] h-full bg-slate-50 border-r flex flex-col shadow-2xl z-10">
        <header className="p-5 border-b bg-white flex items-center justify-between">
          <div>
            <h2 className="font-black text-slate-800 text-xl tracking-tight">RESUMAKE <span className="text-blue-600">PRO</span></h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Builder v2.0</p>
          </div>
          <button 
            onClick={downloadPDF} 
            disabled={isDownloading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={14}/> : <Download size={14}/>}
            {isDownloading ? "SAVING..." : "EXPORT PDF"}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Theme Picker */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Accent Color</p>
            <div className="flex gap-3">
              {['#111827', '#2563eb', '#16a34a', '#dc2626', '#7c3aed'].map(c => (
                <button key={c} onClick={() => setThemeColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${themeColor === c ? 'border-slate-800 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* 1. Header Info */}
          <section>
            <SectionHeader icon={User} title="Header Info" isOpen={activeSections.basic} onToggle={() => toggleSection('basic')} />
            {activeSections.basic && (
              <div className="p-4 border border-t-0 rounded-b-xl space-y-3 bg-white">
                <InputField label="Full Name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
                <InputField label="Headline / Tagline" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  <InputField label="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="LinkedIn" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
                  <InputField label="GitHub" value={form.github} onChange={e => setForm({...form, github: e.target.value})} />
                </div>
                <InputField label="Professional Summary" isTextArea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />
              </div>
            )}
          </section>

          {/* 2. Projects */}
          <section>
            <SectionHeader icon={Code} title="Projects" isOpen={activeSections.projects} onToggle={() => toggleSection('projects')} />
            {activeSections.projects && (
              <div className="p-4 border border-t-0 rounded-b-xl space-y-4 bg-white">
                {form.projects.map((p, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg relative space-y-3 border border-slate-100">
                    <button onClick={() => removeItem('projects', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                    <InputField label="Title" value={p.title} onChange={e => handleArrayChange('projects', i, 'title', e.target.value)} />
                    <InputField label="Technologies" value={p.tech} onChange={e => handleArrayChange('projects', i, 'tech', e.target.value)} />
                    <InputField label="Short Description" value={p.desc} onChange={e => handleArrayChange('projects', i, 'desc', e.target.value)} />
                    <InputField label="Features (Bullet points)" isTextArea value={p.features} onChange={e => handleArrayChange('projects', i, 'features', e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                        <InputField label="Your Role" value={p.role} onChange={e => handleArrayChange('projects', i, 'role', e.target.value)} />
                        <InputField label="Project Link" value={p.link} onChange={e => handleArrayChange('projects', i, 'link', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={() => addItem('projects', {title:'', tech:'', desc:'', features:'', role:'', link:''})} className="w-full py-3 border-2 border-dashed border-slate-200 text-blue-500 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors">+ ADD PROJECT</button>
              </div>
            )}
          </section>

          {/* 3. Education */}
          <section>
            <SectionHeader icon={GraduationCap} title="Education" isOpen={activeSections.education} onToggle={() => toggleSection('education')} />
            {activeSections.education && (
              <div className="p-4 border border-t-0 rounded-b-xl space-y-4 bg-white">
                {form.educations.map((edu, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg relative space-y-3 border border-slate-100">
                    <button onClick={() => removeItem('educations', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                    <InputField label="Degree" value={edu.degree} onChange={e => handleArrayChange('educations', i, 'degree', e.target.value)} />
                    <InputField label="Institution" value={edu.institution} onChange={e => handleArrayChange('educations', i, 'institution', e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                        <InputField label="Year/Period" value={edu.period} onChange={e => handleArrayChange('educations', i, 'period', e.target.value)} />
                        <InputField label="CGPA / %" value={edu.score} onChange={e => handleArrayChange('educations', i, 'score', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={() => addItem('educations', {degree:'', institution:'', period:'', score:''})} className="w-full py-3 border-2 border-dashed border-slate-200 text-blue-500 font-bold text-xs rounded-xl">+ ADD EDUCATION</button>
              </div>
            )}
          </section>

          {/* 4. Experience */}
          <section>
            <SectionHeader icon={Briefcase} title="Experience / Internships" isOpen={activeSections.experience} onToggle={() => toggleSection('experience')} />
            {activeSections.experience && (
              <div className="p-4 border border-t-0 rounded-b-xl space-y-4 bg-white">
                {form.experience.map((exp, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg relative space-y-3 border border-slate-100">
                    <button onClick={() => removeItem('experience', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                    <InputField label="Company Name" value={exp.company} onChange={e => handleArrayChange('experience', i, 'company', e.target.value)} />
                    <InputField label="Role" value={exp.role} onChange={e => handleArrayChange('experience', i, 'role', e.target.value)} />
                    <InputField label="Duration" value={exp.period} onChange={e => handleArrayChange('experience', i, 'period', e.target.value)} />
                    <InputField label="Responsibilities" isTextArea value={exp.desc} onChange={e => handleArrayChange('experience', i, 'desc', e.target.value)} />
                  </div>
                ))}
                <button onClick={() => addItem('experience', {company:'', role:'', period:'', desc:'', tech:''})} className="w-full py-3 border-2 border-dashed border-slate-200 text-blue-500 font-bold text-xs rounded-xl">+ ADD EXPERIENCE</button>
              </div>
            )}
          </section>

          {/* 5. Skills */}
          <section>
            <SectionHeader icon={Award} title="Skills" isOpen={activeSections.skills} onToggle={() => toggleSection('skills')} />
            {activeSections.skills && (
              <div className="p-4 border border-t-0 rounded-b-xl space-y-4 bg-white">
                <p className="text-[10px] font-black text-slate-400 uppercase">Technical Skill Categories</p>
                {form.skills.map((s, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg relative border border-slate-100">
                    <InputField label="Category" value={s.category} onChange={e => handleArrayChange('skills', i, 'category', e.target.value)} />
                    <InputField label="Items" value={s.names} onChange={e => handleArrayChange('skills', i, 'names', e.target.value)} />
                    <button onClick={() => removeItem('skills', i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"><Trash2 size={10}/></button>
                  </div>
                ))}
                <button onClick={() => addItem('skills', {category:'', names:''})} className="text-blue-500 font-black text-[10px] hover:underline">+ ADD CATEGORY</button>
                <div className="pt-2 border-t mt-2">
                    <InputField label="Soft Skills (Comma separated)" isTextArea value={form.softSkills} onChange={e => setForm({...form, softSkills: e.target.value})} />
                </div>
              </div>
            )}
          </section>

          {/* 6. Custom Sections */}
          <section>
            <SectionHeader icon={Layers} title="Custom Sessions" isOpen={activeSections.custom} onToggle={() => toggleSection('custom')} />
            {activeSections.custom && (
              <div className="p-4 border border-t-0 rounded-b-xl space-y-4 bg-white">
                {form.customSections.map((sec, sIdx) => (
                  <div key={sIdx} className="p-4 bg-slate-50 rounded-lg relative space-y-3 border border-slate-100">
                    <button onClick={() => removeItem('customSections', sIdx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                    <InputField label="Session Title" value={sec.title} onChange={e => {
                        const updated = [...form.customSections];
                        updated[sIdx].title = e.target.value;
                        setForm({...form, customSections: updated});
                    }} />
                    <div className="space-y-2">
                        {sec.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex gap-2 items-center">
                                <input className="flex-1 p-2 text-xs border rounded-lg bg-white" value={item} onChange={e => handleCustomItemChange(sIdx, iIdx, e.target.value)} placeholder="Point content..." />
                                <button onClick={() => removeCustomItem(sIdx, iIdx)} className="text-red-300 hover:text-red-500"><Trash2 size={12}/></button>
                            </div>
                        ))}
                        <button onClick={() => addCustomItem(sIdx)} className="text-blue-500 font-black text-[10px]">+ ADD POINT</button>
                    </div>
                  </div>
                ))}
                <button onClick={addCustomSection} className="w-full py-3 border-2 border-dashed border-slate-200 text-blue-500 font-bold text-xs rounded-xl hover:bg-blue-50">+ ADD NEW SESSION</button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* PREVIEW PANEL */}
      <div className="flex-1 bg-slate-300 p-8 overflow-y-auto flex justify-center items-start">
        <div ref={resumeRef} className="w-[210mm] min-h-[297mm] bg-white shadow-2xl flex flex-col text-slate-800 p-0 m-0">
          
          {/* MODERN HEADER */}
          <header className="px-12 py-12 border-b-[8px]" style={{ borderColor: themeColor }}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none" style={{ color: themeColor }}>{form.full_name || "YOUR NAME"}</h1>
                    <p className="text-lg font-bold text-slate-500 mt-2 italic tracking-wide">{form.tagline || "Professional Title"}</p>
                </div>
                <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-600">
                        <span>{form.email}</span> <Mail size={12} style={{ color: themeColor }} />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-600">
                        <span>{form.phone}</span> <Phone size={12} style={{ color: themeColor }} />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-600 underline">
                        <span>{form.linkedin}</span> <Linkedin size={12} style={{ color: themeColor }} />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-600 underline">
                        <span>{form.github}</span> <Github size={12} style={{ color: themeColor }} />
                    </div>
                </div>
            </div>
          </header>

          <div className="flex flex-1">
            {/* MAIN COLUMN (LEFT) */}
            <div className="flex-[1.6] px-12 py-10 space-y-10 border-r border-slate-100">
              
              {/* Summary */}
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                    <div className="h-px bg-slate-200 flex-1"></div>
                    SUMMARY
                </h2>
                <p className="text-[10pt] leading-relaxed text-slate-600 font-medium">{form.summary}</p>
              </section>

              {/* Experience */}
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.25em] mb-6 flex items-center gap-2" style={{ color: themeColor }}>
                    <div className="h-px bg-slate-200 flex-1"></div>
                    EXPERIENCE
                </h2>
                <div className="space-y-8">
                  {form.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-black text-[11pt] text-slate-800 uppercase tracking-tight">{exp.role}</h3>
                        <span className="text-[9pt] font-black text-slate-400">{exp.period}</span>
                      </div>
                      <p className="text-[10pt] font-bold mb-2 uppercase tracking-wide" style={{ color: themeColor }}>{exp.company}</p>
                      <p className="text-[10pt] text-slate-600 leading-relaxed">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Projects */}
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.25em] mb-6 flex items-center gap-2" style={{ color: themeColor }}>
                    <div className="h-px bg-slate-200 flex-1"></div>
                    KEY PROJECTS
                </h2>
                <div className="space-y-10">
                  {form.projects.map((p, i) => (
                    <div key={i} className="relative">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-black text-[11pt] text-slate-800 uppercase">{p.title}</h3>
                        <span className="text-[8pt] font-bold underline text-slate-400">{p.link}</span>
                      </div>
                      <p className="text-[9pt] font-black italic mb-3" style={{ color: themeColor }}>Tech: {p.tech}</p>
                      <p className="text-[10pt] text-slate-700 font-bold mb-1">Role: {p.role}</p>
                      <p className="text-[10pt] text-slate-600 mb-2">{p.desc}</p>
                      {p.features && (
                        <ul className="text-[9pt] text-slate-500 space-y-1 ml-4 list-disc">
                          {p.features.split('\n').map((f, idx) => f.trim() && <li key={idx}>{f}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Custom Sections (Left Side - Even Index) */}
              {form.customSections.filter((_, i) => i % 2 === 0).map((sec, i) => (
                <section key={i}>
                  <h2 className="text-xs font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                      <div className="h-px bg-slate-200 flex-1"></div>
                      {sec.title}
                  </h2>
                  <ul className="text-[10pt] text-slate-600 space-y-2 ml-4 list-disc">
                    {sec.items.map((item, j) => item && <li key={j}>{item}</li>)}
                  </ul>
                </section>
              ))}
            </div>

            {/* SIDEBAR COLUMN (RIGHT) */}
            <div className="flex-1 bg-slate-50/50 px-8 py-10">
              
              {/* Technical Skills */}
              <section className="mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b pb-2" style={{ color: themeColor, borderBottomColor: themeColor }}>Technical Skills</h2>
                <div className="space-y-6">
                  {form.skills.map((s, i) => (
                    <div key={i}>
                      <p className="text-[8pt] font-black text-slate-400 uppercase mb-1 tracking-widest">{s.category}</p>
                      <p className="text-[10pt] font-bold text-slate-700 leading-snug">{s.names}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Soft Skills */}
              <section className="mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b pb-2" style={{ color: themeColor, borderBottomColor: themeColor }}>Professional Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {form.softSkills.split(',').map((skill, i) => (
                        <span key={i} className="text-[9pt] font-bold px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 whitespace-nowrap">
                            {skill.trim()}
                        </span>
                    ))}
                </div>
              </section>

              {/* Education */}
              <section className="mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b pb-2" style={{ color: themeColor, borderBottomColor: themeColor }}>Education</h2>
                <div className="space-y-6">
                  {form.educations.map((edu, i) => (
                    <div key={i}>
                      <p className="text-[10pt] font-black text-slate-800 leading-tight mb-1">{edu.degree}</p>
                      <p className="text-[9pt] font-bold text-slate-500 uppercase leading-tight mb-1">{edu.institution}</p>
                      <div className="flex justify-between text-[8pt] font-black uppercase">
                        <span style={{ color: themeColor }}>{edu.period}</span>
                        <span className="text-slate-400">{edu.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Custom Sections (Right Side - Odd Index) */}
              {form.customSections.filter((_, i) => i % 2 !== 0).map((sec, i) => (
                <section key={i} className="mb-12">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b pb-2" style={{ color: themeColor, borderBottomColor: themeColor }}>{sec.title}</h2>
                  <ul className="text-[10pt] text-slate-600 space-y-2 ml-4 list-disc">
                    {sec.items.map((item, j) => item && <li key={j}>{item}</li>)}
                  </ul>
                </section>
              ))}

            </div>
          </div>
          
          {/* FOOTER STRIP */}
          <footer className="h-2 w-full mt-auto" style={{ backgroundColor: themeColor }}></footer>
        </div>
      </div>
    </div>
  );
}