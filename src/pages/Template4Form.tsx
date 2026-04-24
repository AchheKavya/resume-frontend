import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, User, Mail, Phone, Github, Linkedin, 
  ExternalLink, Briefcase, GraduationCap, Code, 
  ChevronDown, Download, Loader2, Languages, List, Palette, 
  Zap, PlusCircle
} from 'lucide-react';

// --- THEME CONFIGURATION ---
const THEMES = {
  green: { primary: 'text-green-700', bg: 'bg-green-50', border: 'border-green-700', accent: 'bg-green-600', hover: 'hover:bg-green-700', sidebar: 'bg-[#F8FDF9]', bullet: 'text-green-500' },
  blue: { primary: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-700', accent: 'bg-blue-600', hover: 'hover:bg-blue-700', sidebar: 'bg-[#F8FAFD]', bullet: 'text-blue-500' },
  black: { primary: 'text-slate-900', bg: 'bg-slate-100', border: 'border-slate-900', accent: 'bg-slate-900', hover: 'hover:bg-slate-800', sidebar: 'bg-[#FCFCFC]', bullet: 'text-slate-900' }
};

// --- SHARED UI COMPONENTS ---

const SectionHeader = ({ icon: Icon, title, isOpen, onToggle, theme }) => (
  <button 
    onClick={onToggle}
    className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${theme.bg} ${theme.primary}`}>
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

const InputField = ({ label, placeholder, value, onChange, type = "text", isTextArea = false }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    {isTextArea ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-400 outline-none transition-all text-sm text-slate-700 bg-slate-50/50"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-400 outline-none transition-all text-sm text-slate-700 bg-slate-50/50"
      />
    )}
  </div>
);

// --- MAIN COMPONENT ---

export default function App() {
  const resumeRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [themeKey, setThemeKey] = useState('green');
  const activeTheme = THEMES[themeKey];

  const [form, setForm] = useState({
    full_name: "Kavya Achhe",
    role: "Junior Software Engineer",
    email: "kavyaachhe4@gmail.com",
    phone: "9876543210",
    github: "github.com/kavya",
    linkedin: "linkedin.com/in/kavya",
    profile: "Experienced Full Stack Software Engineer with 8+ years of expertise in building scalable web applications. Proven track record of leading distributed teams and optimizing mission-critical CI/CD pipelines.",
    
    experience: [
      { role: "Senior Software Engineer", company: "Tech Solutions Pvt. Ltd.", period: "2020 - Present", points: ["Led a team of 5 engineers in migrating legacy microservices to Kubernetes.", "Reduced deployment time by 40% using optimized Jenkins pipelines."] }
    ],
    education: [
      { degree: "B.Tech in Computer Science", institute: "IIT Delhi", period: "2013 - 2017" }
    ],
    projects: [
      { name: "Global E-commerce Hub", link: "github.com/project", points: ["Architected a high-concurrency payment gateway handling 10k tps."] }
    ],
    skills: [
      { category: "Frontend", list: "React, Tailwind, Next.js, TypeScript" },
      { category: "Backend", list: "Node.js, Go, PostgreSQL, Redis" }
    ],
    languages: [
      { name: "English", level: "Native" },
      { name: "German", level: "Intermediate (B2)" }
    ],
    customSections: [
      { title: "Volunteering", points: ["Taught coding to 20+ underprivileged students."] }
    ]
  });

  const [activeSections, setActiveSections] = useState({
    basics: true, exp: true, edu: true, proj: true, skills: true, lang: true, custom: true
  });

  useEffect(() => {
    const loadScript = (src) => new Promise(res => {
      const s = document.createElement('script'); s.src = src; s.onload = res; document.head.appendChild(s);
    });
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
    ]).then(() => setLibsLoaded(true));
  }, []);

  // --- HANDLERS ---
  const handleArr = (f, i, k, v) => {
    const u = [...form[f]]; u[i][k] = v; setForm({...form, [f]: u});
  };
  const addEntry = (f, obj) => setForm(p => ({...p, [f]: [...p[f], obj]}));
  const remEntry = (f, i) => {
    const u = [...form[f]]; u.splice(i, 1); setForm({...form, [f]: u});
  };

  const addPoint = (field, entryIndex) => {
    const updated = [...form[field]];
    updated[entryIndex].points = [...updated[entryIndex].points, ""];
    setForm({...form, [field]: updated});
  };

  const handlePointChange = (field, entryIndex, pointIndex, value) => {
    const updated = [...form[field]];
    updated[entryIndex].points[pointIndex] = value;
    setForm({...form, [field]: updated});
  };

  const remPoint = (field, entryIndex, pointIndex) => {
    const updated = [...form[field]];
    updated[entryIndex].points.splice(pointIndex, 1);
    setForm({...form, [field]: updated});
  };

  const downloadPDF = async () => {
    if (!resumeRef.current || !libsLoaded) return;
    setIsDownloading(true);
    const canvas = await window.html2canvas(resumeRef.current, { scale: 3, useCORS: true });
    const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
    pdf.save(`${form.full_name}_Resume.pdf`);
    setIsDownloading(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900">
      
      {/* EDITOR SIDEBAR */}
      <div className="w-[550px] h-full bg-white border-r flex flex-col shadow-2xl z-20 overflow-y-auto">
        <header className="p-6 border-b sticky top-0 bg-white z-30 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="font-black text-xl text-slate-800 tracking-tighter uppercase">CV <span className={`italic ${activeTheme.primary}`}>PRO</span></h1>
            <button 
              onClick={downloadPDF} 
              className={`${activeTheme.accent} text-white px-5 py-2 rounded-xl font-bold text-xs flex gap-2 items-center ${activeTheme.hover} transition-all shadow-lg shadow-slate-200`}
            >
              {isDownloading ? <Loader2 className="animate-spin" size={14}/> : <Download size={14}/>} DOWNLOAD PDF
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Palette size={16} className="text-slate-400" />
            <div className="flex gap-2">
              {['green', 'blue', 'black'].map(t => (
                <button 
                  key={t}
                  onClick={() => setThemeKey(t)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${themeKey === t ? 'scale-125 border-slate-400' : 'border-transparent'}`}
                  style={{ backgroundColor: t === 'black' ? '#1e293b' : t === 'blue' ? '#1d4ed8' : '#15803d' }}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase text-slate-400 ml-auto tracking-widest">Theme Mode</span>
          </div>
        </header>

        <div className="p-6 space-y-6 pb-32">
          
          {/* Basics */}
          <SectionHeader theme={activeTheme} icon={User} title="Personal Details" isOpen={activeSections.basics} onToggle={() => setActiveSections({...activeSections, basics: !activeSections.basics})} />
          {activeSections.basics && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Full Name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
                <InputField label="Job Title" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
              </div>
              <InputField label="Profile Summary" isTextArea value={form.profile} onChange={e => setForm({...form, profile: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <InputField label="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <InputField label="GitHub" value={form.github} onChange={e => setForm({...form, github: e.target.value})} />
                <InputField label="LinkedIn" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
              </div>
            </div>
          )}

          {/* Education */}
          <SectionHeader theme={activeTheme} icon={GraduationCap} title="Education" isOpen={activeSections.edu} onToggle={() => setActiveSections({...activeSections, edu: !activeSections.edu})} />
          {activeSections.edu && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
              {form.education.map((ed, i) => (
                <div key={i} className="p-4 bg-white border rounded-xl relative space-y-3">
                  <button onClick={() => remEntry('education', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                  <InputField label="Degree / Course" value={ed.degree} onChange={e => handleArr('education', i, 'degree', e.target.value)} />
                  <InputField label="Institution" value={ed.institute} onChange={e => handleArr('education', i, 'institute', e.target.value)} />
                  <InputField label="Time Period" value={ed.period} onChange={e => handleArr('education', i, 'period', e.target.value)} />
                </div>
              ))}
              <button onClick={() => addEntry('education', {degree:'', institute:'', period:''})} className="w-full py-2 bg-white border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs rounded-xl hover:bg-white hover:border-slate-300 transition-colors">+ ADD EDUCATION</button>
            </div>
          )}

          {/* Work Experience */}
          <SectionHeader theme={activeTheme} icon={Briefcase} title="Experience" isOpen={activeSections.exp} onToggle={() => setActiveSections({...activeSections, exp: !activeSections.exp})} />
          {activeSections.exp && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-6">
              {form.experience.map((ex, i) => (
                <div key={i} className="p-4 bg-white border rounded-xl relative space-y-3 shadow-sm">
                  <button onClick={() => remEntry('experience', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                  <InputField label="Role" value={ex.role} onChange={e => handleArr('experience', i, 'role', e.target.value)} />
                  <InputField label="Company" value={ex.company} onChange={e => handleArr('experience', i, 'company', e.target.value)} />
                  <InputField label="Period" value={ex.period} onChange={e => handleArr('experience', i, 'period', e.target.value)} />
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase ${activeTheme.primary}`}>Responsibilities</label>
                    {ex.points.map((p, pi) => (
                      <div key={pi} className="flex gap-2">
                        <input className="flex-1 p-2 text-xs border rounded bg-slate-50" value={p} onChange={e => handlePointChange('experience', i, pi, e.target.value)} />
                        <button onClick={() => remPoint('experience', i, pi)} className="text-slate-300"><Trash2 size={14}/></button>
                      </div>
                    ))}
                    <button onClick={() => addPoint('experience', i)} className={`text-[10px] font-bold ${activeTheme.primary} flex items-center gap-1 hover:underline`}>+ ADD POINT</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addEntry('experience', {role:'', company:'', period:'', points:['']})} className="w-full py-2 bg-white border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs rounded-xl">+ ADD WORK ENTRY</button>
            </div>
          )}

          {/* Skills */}
          <SectionHeader theme={activeTheme} icon={Zap} title="Skills" isOpen={activeSections.skills} onToggle={() => setActiveSections({...activeSections, skills: !activeSections.skills})} />
          {activeSections.skills && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
              {form.skills.map((s, i) => (
                <div key={i} className="p-4 bg-white border rounded-xl relative space-y-3">
                  <button onClick={() => remEntry('skills', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                  <InputField label="Category" value={s.category} onChange={e => handleArr('skills', i, 'category', e.target.value)} />
                  <InputField label="Skill List (comma separated)" value={s.list} onChange={e => handleArr('skills', i, 'list', e.target.value)} />
                </div>
              ))}
              <button onClick={() => addEntry('skills', {category:'', list:''})} className="w-full py-2 bg-white border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs rounded-xl">+ ADD SKILL GROUP</button>
            </div>
          )}

          {/* Languages */}
          <SectionHeader theme={activeTheme} icon={Languages} title="Languages" isOpen={activeSections.lang} onToggle={() => setActiveSections({...activeSections, lang: !activeSections.lang})} />
          {activeSections.lang && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
              {form.languages.map((l, i) => (
                <div key={i} className="p-4 bg-white border rounded-xl relative space-y-3">
                  <button onClick={() => remEntry('languages', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Language" value={l.name} onChange={e => handleArr('languages', i, 'name', e.target.value)} />
                    <InputField label="Proficiency" value={l.level} onChange={e => handleArr('languages', i, 'level', e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={() => addEntry('languages', {name:'', level:''})} className="w-full py-2 bg-white border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs rounded-xl">+ ADD LANGUAGE</button>
            </div>
          )}

          {/* Projects */}
          <SectionHeader theme={activeTheme} icon={Code} title="Projects" isOpen={activeSections.proj} onToggle={() => setActiveSections({...activeSections, proj: !activeSections.proj})} />
          {activeSections.proj && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-6">
              {form.projects.map((pr, i) => (
                <div key={i} className="p-4 bg-white border rounded-xl relative space-y-3 shadow-sm">
                  <button onClick={() => remEntry('projects', i)} className="absolute top-2 right-2 text-slate-300"><Trash2 size={16}/></button>
                  <InputField label="Project Name" value={pr.name} onChange={e => handleArr('projects', i, 'name', e.target.value)} />
                  <InputField label="Link" value={pr.link} onChange={e => handleArr('projects', i, 'link', e.target.value)} />
                  <div className="space-y-2">
                    {pr.points.map((p, pi) => (
                      <div key={pi} className="flex gap-2">
                        <input className="flex-1 p-2 text-xs border rounded bg-slate-50" value={p} onChange={e => handlePointChange('projects', i, pi, e.target.value)} />
                        <button onClick={() => remPoint('projects', i, pi)} className="text-slate-300"><Trash2 size={14}/></button>
                      </div>
                    ))}
                    <button onClick={() => addPoint('projects', i)} className={`text-[10px] font-bold ${activeTheme.primary} flex items-center gap-1`}>+ ADD POINT</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addEntry('projects', {name:'', link:'', points:['']})} className="w-full py-2 bg-white border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs rounded-xl">+ ADD PROJECT</button>
            </div>
          )}

          {/* Custom Section */}
          <SectionHeader theme={activeTheme} icon={List} title="Custom Section" isOpen={activeSections.custom} onToggle={() => setActiveSections({...activeSections, custom: !activeSections.custom})} />
          {activeSections.custom && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-6">
              {form.customSections.map((cs, i) => (
                <div key={i} className="p-4 bg-white border rounded-xl relative space-y-3 shadow-sm">
                  <button onClick={() => remEntry('customSections', i)} className="absolute top-2 right-2 text-slate-300"><Trash2 size={16}/></button>
                  <InputField label="Title" value={cs.title} onChange={e => handleArr('customSections', i, 'title', e.target.value)} />
                  <div className="space-y-2">
                    {cs.points.map((p, pi) => (
                      <div key={pi} className="flex gap-2">
                        <input className="flex-1 p-2 text-xs border rounded bg-slate-50" value={p} onChange={e => handlePointChange('customSections', i, pi, e.target.value)} />
                        <button onClick={() => remPoint('customSections', i, pi)} className="text-slate-300"><Trash2 size={14}/></button>
                      </div>
                    ))}
                    <button onClick={() => addPoint('customSections', i)} className={`text-[10px] font-bold ${activeTheme.primary} flex items-center gap-1`}>+ ADD POINT</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addEntry('customSections', {title:'', points:['']})} className="w-full py-2 bg-white border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs rounded-xl">+ ADD CUSTOM SESSION</button>
            </div>
          )}
        </div>
      </div>

      {/* PREVIEW PANEL */}
      <div className="flex-1 overflow-y-auto p-12 bg-slate-200 flex justify-center">
        <div ref={resumeRef} className="w-[210mm] min-h-[297mm] h-fit bg-white shadow-2xl flex font-sans text-[#101820]">
          
          {/* SIDEBAR */}
          <div className={`w-[32%] ${activeTheme.sidebar} p-8 border-r border-slate-100 flex flex-col space-y-10`}>
            <div>
              <h1 className={`text-4xl font-black ${activeTheme.primary} uppercase leading-none break-words`}>{form.full_name}</h1>
              <p className={`text-xs font-bold ${activeTheme.primary} opacity-80 mt-3 italic tracking-wide uppercase`}>{form.role}</p>
              
              <div className="mt-8 space-y-3 text-[8.5pt] text-slate-600">
                {form.email && <div className="flex items-center gap-2"><Mail size={12} className={activeTheme.primary}/> {form.email}</div>}
                {form.phone && <div className="flex items-center gap-2"><Phone size={12} className={activeTheme.primary}/> {form.phone}</div>}
                {form.github && <div className="flex items-center gap-2"><Github size={12} className={activeTheme.primary}/> {form.github}</div>}
                {form.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} className={activeTheme.primary}/> {form.linkedin}</div>}
              </div>
            </div>

            <section>
              <h3 className={`text-[9px] font-black ${activeTheme.primary} uppercase border-b-2 ${activeTheme.border} pb-1 mb-4 tracking-[0.2em]`}>Profile</h3>
              <p className="text-[9pt] text-slate-600 leading-relaxed italic">{form.profile}</p>
            </section>

            <section>
              <h3 className={`text-[9px] font-black ${activeTheme.primary} uppercase border-b-2 ${activeTheme.border} pb-1 mb-4 tracking-[0.2em]`}>Education</h3>
              <div className="space-y-5">
                {form.education.map((ed, i) => (
                  <div key={i}>
                    <p className="text-[10pt] font-black text-slate-800 leading-tight uppercase">{ed.degree}</p>
                    <p className="text-[8.5pt] text-slate-600 font-medium mt-0.5">{ed.institute}</p>
                    <p className={`text-[8pt] ${activeTheme.primary} font-bold mt-1 italic opacity-80`}>{ed.period}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className={`text-[9px] font-black ${activeTheme.primary} uppercase border-b-2 ${activeTheme.border} pb-1 mb-4 tracking-[0.2em]`}>Languages</h3>
              <div className="space-y-2">
                {form.languages.map((l, i) => (
                  <p key={i} className="text-[9pt] font-bold text-slate-800">
                    {l.name} <span className="font-normal text-slate-400 italic block text-[8pt]">— {l.level}</span>
                  </p>
                ))}
              </div>
            </section>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 p-12 flex flex-col space-y-12">
            
            <section>
              <h2 className={`text-xl font-black ${activeTheme.primary} uppercase border-b-2 ${activeTheme.border} pb-1 mb-6 tracking-widest`}>Work Experience</h2>
              <div className="space-y-10">
                {form.experience.map((ex, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-3">
                      <h4 className="font-black text-slate-900 text-[11pt] uppercase tracking-tighter">
                        {ex.role} <span className="font-normal text-slate-400 mx-1">@</span> {ex.company}
                      </h4>
                      <p className={`text-[8.5pt] ${activeTheme.primary} font-black italic`}>{ex.period}</p>
                    </div>
                    <ul className="space-y-2">
                      {ex.points.map((p, j) => (
                        <li key={j} className="text-[9.5pt] text-slate-600 leading-relaxed flex gap-3">
                          <span className={`${activeTheme.bullet} font-bold`}>•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={`text-xl font-black ${activeTheme.primary} uppercase border-b-2 ${activeTheme.border} pb-1 mb-6 tracking-widest`}>Skills</h2>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {form.skills.map((s, i) => (
                  <div key={i}>
                    <span className="font-black text-slate-900 uppercase text-[7.5pt] block mb-1.5 tracking-wider">{s.category}</span>
                    <p className="text-[9.5pt] text-slate-600 leading-tight">{s.list}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={`text-xl font-black ${activeTheme.primary} uppercase border-b-2 ${activeTheme.border} pb-1 mb-6 tracking-widest`}>Projects</h2>
              <div className="space-y-8">
                {form.projects.map((pr, i) => (
                  <div key={i}>
                    <h4 className="font-black text-slate-800 text-[11pt] uppercase flex items-center gap-2 mb-2">
                      {pr.name} {pr.link && <ExternalLink size={11} className={`${activeTheme.primary} opacity-60`}/>}
                    </h4>
                    <ul className="space-y-1">
                      {pr.points.map((p, j) => (
                        <li key={j} className="text-[9.5pt] text-slate-600 leading-relaxed flex gap-3">
                          <span className={activeTheme.bullet}>•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {form.customSections.map((cs, i) => (
              <section key={i}>
                <h2 className={`text-xl font-black ${activeTheme.primary} uppercase border-b-2 ${activeTheme.border} pb-1 mb-6 tracking-widest`}>{cs.title || "Section"}</h2>
                <ul className="space-y-2">
                  {cs.points.map((p, j) => (
                    <li key={j} className="text-[9.5pt] text-slate-600 leading-relaxed flex gap-3">
                      <span className={activeTheme.bullet}>•</span> {p}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

