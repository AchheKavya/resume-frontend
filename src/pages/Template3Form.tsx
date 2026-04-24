import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, User, Briefcase, Mail, Phone, MapPin, 
  ChevronDown, Download, Loader2, GraduationCap, 
  Heart, Award, Layout, Settings, FolderKanban, 
  Smile, Construction, Globe, Linkedin, List
} from 'lucide-react';

// --- SHARED UI COMPONENTS ---

const SectionHeader = ({ icon: Icon, title, isOpen, onToggle, color }) => (
  <button 
    onClick={onToggle}
    className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-t-xl hover:bg-slate-50 transition-colors mt-4"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10`, color: color }}>
        <Icon size={18} />
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
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] text-sm text-slate-700 bg-slate-50/50"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-700 bg-slate-50/50"
      />
    )}
  </div>
);

// --- MAIN MASTER COMPONENT ---

export default function App() {
  const resumeRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);
 
  const [themeColor, setThemeColor] = useState('#16a34a');

  const [form, setForm] = useState({
    full_name: "Kavya Jampala",
    phone: "+91 98765 43210",
    email: "jamplakavya@gmail.com",
    location: "Hyderabad, India",
    role: "Full Stack Developer",
    summary: "Dedicated software engineer passionate about creating intuitive user experiences and robust backend architectures.",
    
    skillGroups: [
      { category: "Frameworks", list: "React, Node.js, Tailwind CSS" },
      { category: "Languages", list: "JavaScript, Python, C++" }
    ],

    softSkills: ["Communication", "Problem-solving", "Teamwork", "Time management", "Adaptability"],
    hobbies: ["Photography", "Open Source", "Gaming"],

    education: [
      { degree: "B.Tech in Computer Science", institution: "Tech Institute", startYear: "2019", endYear: "2023" }
    ],

    experience: [
      { company: "Global Tech Solutions", role: "Software Intern", duration: "6 Months", responsibilities: "Assisted in front-end development using React and managed API integrations.", technologies: "React, REST API, Git" }
    ],

    projects: [
      { name: "E-Commerce App", description: "A fully functional shopping platform.", technologies: "MERN Stack", features: "Payment gateway, Auth, Cart", role: "Solo Developer" }
    ],

    customSections: [], // Custom Main Sections
    customSidebarSections: [] // Custom Sidebar Sections
  });

  const [activeSections, setActiveSections] = useState({
    header: true, skills: true, soft: true, hobbies: true, edu: true, exp: true, proj: true, custom: true, customSide: true
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

  const handleArr = (f, i, k, v) => {
    const u = [...form[f]]; u[i][k] = v; setForm({...form, [f]: u});
  };
  const add = (f, o) => setForm(p => ({...p, [f]: [...p[f], o]}));
  const rem = (f, i) => {
    const u = [...form[f]]; u.splice(i, 1); setForm({...form, [f]: u});
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

  const renderContent = (content, isPoints) => {
    if (!isPoints) return content;
    return (
      <ul className="list-disc list-inside space-y-1">
        {content.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
          <li key={idx}>{line.replace(/^[•\-\*]\s*/, '')}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900 font-sans">
      
      {/* EDITOR PANEL */}
      <div className="w-[500px] h-full bg-white border-r flex flex-col shadow-2xl z-20 overflow-y-auto">
        <header className="p-6 border-b bg-white sticky top-0 z-30 flex justify-between items-center">
          <h1 className="font-black text-lg tracking-tight text-slate-800 uppercase italic">Resumake <span className="text-green-600">v2.2</span></h1>
          <button onClick={downloadPDF} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs flex gap-2 items-center hover:bg-green-700 transition-all">
            {isDownloading ? <Loader2 className="animate-spin" size={14}/> : <Download size={14}/>} DOWNLOAD PDF
          </button>
        </header>

        <div className="p-6 space-y-2 pb-24">
          {/* Personal Details */}
          <SectionHeader icon={User} title="Personal Details" isOpen={activeSections.header} onToggle={() => setActiveSections({...activeSections, header: !activeSections.header})} color={themeColor} />
          {activeSections.header && (
            <div className="p-4 border border-t-0 rounded-b-xl bg-slate-50/50 space-y-3">
              <InputField label="Full Name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
              <InputField label="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <InputField label="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="relative group">
                <InputField label="Address / Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                <button 
                  onClick={() => setForm({...form, location: ""})} 
                  className="absolute right-3 top-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
              <InputField label="Summary" isTextArea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />
            </div>
          )}

          {/* Experience */}
          <SectionHeader icon={Briefcase} title="Experience" isOpen={activeSections.exp} onToggle={() => setActiveSections({...activeSections, exp: !activeSections.exp})} color={themeColor} />
          {activeSections.exp && (
            <div className="p-4 border border-t-0 rounded-b-xl bg-slate-50/50 space-y-4">
              {form.experience.map((exp, i) => (
                <div key={i} className="p-3 bg-white border rounded-lg relative space-y-3 group">
                  <button onClick={() => rem('experience', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                  <InputField label="Company Name" value={exp.company} onChange={e => handleArr('experience', i, 'company', e.target.value)} />
                  <InputField label="Role (Intern / Developer)" value={exp.role} onChange={e => handleArr('experience', i, 'role', e.target.value)} />
                  <InputField label="Duration" value={exp.duration} onChange={e => handleArr('experience', i, 'duration', e.target.value)} />
                  <InputField label="Responsibilities" isTextArea value={exp.responsibilities} onChange={e => handleArr('experience', i, 'responsibilities', e.target.value)} />
                  <InputField label="Technologies used" value={exp.technologies} onChange={e => handleArr('experience', i, 'technologies', e.target.value)} />
                </div>
              ))}
              <button onClick={() => add('experience', {company:'', role:'', duration:'', responsibilities:'', technologies:''})} className="w-full py-2 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-[10px] hover:border-blue-300 hover:text-blue-500">+ ADD EXPERIENCE / INTERNSHIP</button>
            </div>
          )}

          {/* Projects */}
          <SectionHeader icon={FolderKanban} title="Projects" isOpen={activeSections.proj} onToggle={() => setActiveSections({...activeSections, proj: !activeSections.proj})} color={themeColor} />
          {activeSections.proj && (
            <div className="p-4 border border-t-0 rounded-b-xl bg-slate-50/50 space-y-4">
              {form.projects.map((proj, i) => (
                <div key={i} className="p-3 bg-white border rounded-lg relative space-y-3 group">
                  <button onClick={() => rem('projects', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                  <InputField label="Project Name" value={proj.name} onChange={e => handleArr('projects', i, 'name', e.target.value)} />
                  <InputField label="Description" value={proj.description} onChange={e => handleArr('projects', i, 'description', e.target.value)} />
                  <InputField label="Technologies" value={proj.technologies} onChange={e => handleArr('projects', i, 'technologies', e.target.value)} />
                  <InputField label="Features" value={proj.features} onChange={e => handleArr('projects', i, 'features', e.target.value)} />
                  <InputField label="Role" value={proj.role} onChange={e => handleArr('projects', i, 'role', e.target.value)} />
                </div>
              ))}
              <button onClick={() => add('projects', {name:'', description:'', technologies:'', features:'', role:''})} className="w-full py-2 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-[10px] hover:border-blue-300 hover:text-blue-500">+ ADD PROJECT</button>
            </div>
          )}

          {/* Soft Skills */}
          <SectionHeader icon={Smile} title="Soft Skills" isOpen={activeSections.soft} onToggle={() => setActiveSections({...activeSections, soft: !activeSections.soft})} color={themeColor} />
          {activeSections.soft && (
            <div className="p-4 border border-t-0 rounded-b-xl bg-slate-50/50 space-y-2">
              {form.softSkills.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input className="flex-1 p-2 text-sm bg-white border rounded outline-none" value={s} onChange={e => {
                    const u = [...form.softSkills]; u[i] = e.target.value; setForm({...form, softSkills: u});
                  }} />
                  <button onClick={() => {
                    const u = form.softSkills.filter((_, idx) => idx !== i); setForm({...form, softSkills: u});
                  }} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                </div>
              ))}
              <button onClick={() => setForm({...form, softSkills: [...form.softSkills, ""]})} className="text-[10px] font-bold text-blue-600">+ ADD SOFT SKILL</button>
            </div>
          )}

          {/* Expertise */}
          <SectionHeader icon={Settings} title="Hard Skills (Expertise)" isOpen={activeSections.skills} onToggle={() => setActiveSections({...activeSections, skills: !activeSections.skills})} color={themeColor} />
          {activeSections.skills && (
            <div className="p-4 border border-t-0 rounded-b-xl bg-slate-50/50 space-y-4">
              {form.skillGroups.map((g, i) => (
                <div key={i} className="p-3 bg-white border rounded-lg relative space-y-2 group">
                  <button onClick={() => rem('skillGroups', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                  <InputField label="Category" value={g.category} onChange={e => handleArr('skillGroups', i, 'category', e.target.value)} />
                  <InputField label="Skills" value={g.list} onChange={e => handleArr('skillGroups', i, 'list', e.target.value)} />
                </div>
              ))}
              <button onClick={() => add('skillGroups', {category:'', list:''})} className="w-full py-2 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-[10px]">+ ADD SKILL GROUP</button>
            </div>
          )}

          {/* Education */}
          <SectionHeader icon={GraduationCap} title="Education" isOpen={activeSections.edu} onToggle={() => setActiveSections({...activeSections, edu: !activeSections.edu})} color={themeColor} />
          {activeSections.edu && (
            <div className="p-4 border border-t-0 rounded-b-xl bg-slate-50/50 space-y-4">
              {form.education.map((edu, i) => (
                <div key={i} className="p-3 bg-white border rounded-lg relative space-y-2 group">
                  <button onClick={() => rem('education', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                  <InputField label="Degree" value={edu.degree} onChange={e => handleArr('education', i, 'degree', e.target.value)} />
                  <InputField label="Institution" value={edu.institution} onChange={e => handleArr('education', i, 'institution', e.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField label="Start Year" value={edu.startYear} onChange={e => handleArr('education', i, 'startYear', e.target.value)} />
                    <InputField label="End Year" value={edu.endYear} onChange={e => handleArr('education', i, 'endYear', e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={() => add('education', {degree:'', institution:'', startYear:'', endYear:''})} className="w-full py-2 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-[10px]">+ ADD EDUCATION</button>
            </div>
          )}

          {/* Custom Main Body Sections */}
          <SectionHeader icon={Layout} title="Custom Sections (Main Body)" isOpen={activeSections.custom} onToggle={() => setActiveSections({...activeSections, custom: !activeSections.custom})} color={themeColor} />
          {activeSections.custom && (
            <div className="p-4 border border-t-0 rounded-b-xl bg-slate-50/50 space-y-4">
              {form.customSections.map((cs, i) => (
                <div key={i} className="p-3 bg-white border rounded-lg relative space-y-3 group">
                  <button onClick={() => rem('customSections', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                  <InputField label="Section Title" value={cs.title} onChange={e => handleArr('customSections', i, 'title', e.target.value)} />
                  <div className="flex items-center gap-2 mb-2">
                    <button 
                      onClick={() => handleArr('customSections', i, 'isPoints', !cs.isPoints)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${cs.isPoints ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}
                    >
                      <List size={12}/> {cs.isPoints ? 'POINTS ENABLED' : 'USE BULLET POINTS'}
                    </button>
                  </div>
                  <InputField label="Content (New line for new point)" isTextArea value={cs.content} onChange={e => handleArr('customSections', i, 'content', e.target.value)} />
                </div>
              ))}
              <button onClick={() => add('customSections', {title:'', content:'', isPoints: false})} className="w-full py-2 border-2 border-dashed border-blue-200 text-blue-500 font-bold text-[10px]">+ NEW MAIN SECTION</button>
            </div>
          )}

          {/* Custom Sidebar Sections */}
          <SectionHeader icon={Construction} title="Custom Sections (Sidebar)" isOpen={activeSections.customSide} onToggle={() => setActiveSections({...activeSections, customSide: !activeSections.customSide})} color={themeColor} />
          {activeSections.customSide && (
            <div className="p-4 border border-t-0 rounded-b-xl bg-slate-50/50 space-y-4">
              {form.customSidebarSections.map((cs, i) => (
                <div key={i} className="p-3 bg-white border rounded-lg relative space-y-3 group">
                  <button onClick={() => rem('customSidebarSections', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                  <InputField label="Section Title" value={cs.title} onChange={e => handleArr('customSidebarSections', i, 'title', e.target.value)} />
                  <div className="flex items-center gap-2 mb-2">
                    <button 
                      onClick={() => handleArr('customSidebarSections', i, 'isPoints', !cs.isPoints)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${cs.isPoints ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}
                    >
                      <List size={12}/> {cs.isPoints ? 'POINTS ENABLED' : 'USE BULLET POINTS'}
                    </button>
                  </div>
                  <InputField label="Content (New line for new point)" isTextArea value={cs.content} onChange={e => handleArr('customSidebarSections', i, 'content', e.target.value)} />
                </div>
              ))}
              <button onClick={() => add('customSidebarSections', {title:'', content:'', isPoints: false})} className="w-full py-2 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-[10px]">+ NEW SIDEBAR SECTION</button>
            </div>
          )}
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="flex-1 overflow-y-auto p-12 bg-slate-300 flex justify-center">
        <div ref={resumeRef} className="w-[210mm] min-h-[297mm] h-fit bg-white shadow-2xl flex">
          
          {/* Sidebar */}
          <div className="w-[32%] bg-[#1e293b] text-white p-8 space-y-10">
            {/* Contact */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2 mb-4">Contact</h3>
              <div className="space-y-4 text-[8.5pt]">
                <div className="flex items-center gap-3"><Mail size={12} className="text-blue-400"/> {form.email}</div>
                <div className="flex items-center gap-3"><Phone size={12} className="text-blue-400"/> {form.phone}</div>
                {form.location && <div className="flex items-center gap-3"><MapPin size={12} className="text-blue-400"/> {form.location}</div>}
              </div>
            </div>

            {/* Expertise */}
            {form.skillGroups.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2 mb-4">Expertise</h3>
                {form.skillGroups.map((g, i) => (
                  <div key={i} className="mb-4">
                    <p className="text-[7.5pt] font-black text-blue-400 uppercase mb-1">{g.category}</p>
                    <p className="text-[8.5pt] text-slate-300 leading-relaxed font-light">{g.list}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Soft Skills */}
            {form.softSkills.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2 mb-4">Soft Skills</h3>
                <ul className="space-y-1 text-[8.5pt] text-slate-300 font-light list-inside list-disc">
                  {form.softSkills.map((s, i) => s && <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {/* Custom Sidebar Sections */}
            {form.customSidebarSections.map((cs, i) => (
              <div key={i}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2 mb-4">{cs.title}</h3>
                <div className="text-[8.5pt] text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
                  {renderContent(cs.content, cs.isPoints)}
                </div>
              </div>
            ))}
            
            {/* Hobbies */}
            {form.hobbies.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2 mb-4">Hobbies</h3>
                <div className="flex flex-wrap gap-2">
                   {form.hobbies.map((h, i) => h && <span key={i} className="text-[8pt] bg-slate-800 px-2 py-1 rounded text-slate-300">{h}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Main Body */}
          <div className="flex-1 p-12">
            <header className="mb-10">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{form.full_name}</h1>
              <p className="text-green-600 font-bold">{form.role}</p>
              <p className="mt-8 text-[10pt] text-slate-600 leading-relaxed italic">{form.summary}</p>
            </header>

            {/* Experience Rendering */}
            {form.experience.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-full bg-slate-900 text-white"><Briefcase size={14}/></div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">Professional Experience</h2>
                </div>
                <div className="space-y-8 ml-4 pl-6 border-l-2 border-slate-100">
                  {form.experience.map((exp, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31.5px] top-1.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-[11pt] text-slate-800">{exp.role}</h3>
                        <span className="text-[9pt] font-bold text-slate-400 italic">{exp.duration}</span>
                      </div>
                      <p className="text-[10pt] text-green-600 font-bold mb-2">{exp.company}</p>
                      <p className="text-[9.5pt] text-slate-600 mb-3 leading-relaxed whitespace-pre-wrap">{exp.responsibilities}</p>
                      {exp.technologies && (
                        <p className="text-[8.5pt] text-slate-500 font-medium italic">Stack: {exp.technologies}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Rendering */}
            {form.projects.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-full bg-slate-900 text-white"><FolderKanban size={14}/></div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">Personal Projects</h2>
                </div>
                <div className="space-y-8 ml-4 pl-6 border-l-2 border-slate-100">
                  {form.projects.map((proj, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-[11pt] text-slate-800">{proj.name}</h3>
                        <span className="text-[8pt] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{proj.role}</span>
                      </div>
                      <p className="text-[9.5pt] text-slate-600 leading-relaxed mb-3">{proj.description}</p>
                      <div className="space-y-1">
                        <p className="text-[9pt]"><span className="font-bold text-slate-700 uppercase text-[7.5pt]">Features:</span> {proj.features}</p>
                        <p className="text-[9pt]"><span className="font-bold text-slate-700 uppercase text-[7.5pt]">Technologies:</span> {proj.technologies}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education Rendering */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-slate-900 text-white"><GraduationCap size={14}/></div>
                <h2 className="text-lg font-black text-slate-900 uppercase">Education</h2>
              </div>
              <div className="space-y-6 ml-4 pl-6 border-l-2 border-slate-100">
                {form.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[11pt] text-slate-800 uppercase">{edu.degree}</h3>
                      <span className="text-[9pt] font-bold text-slate-400">{edu.startYear} — {edu.endYear}</span>
                    </div>
                    <p className="text-[10pt] text-green-600 font-medium">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Custom Main Body Rendering */}
            {form.customSections.map((cs, i) => (
              <section key={i} className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-full bg-slate-900 text-white"><Award size={14}/></div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">{cs.title || 'Other'}</h2>
                </div>
                <div className="ml-4 pl-6 border-l-2 border-slate-100">
                  <div className="text-[9.5pt] text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {renderContent(cs.content, cs.isPoints)}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}