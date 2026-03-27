export interface Resume {
  id: number;
  name: string;
  email: string;
  department: string;
  subdepartment: string;
  experience: number;
  uploadDate: string;
  fileName: string;
}

export const mockResumes: Resume[] = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", department: "Web Development", subdepartment: "Frontend", experience: 3, uploadDate: "2026-03-25", fileName: "rahul_resume.pdf" },
  { id: 2, name: "Priya Patel", email: "priya@example.com", department: "Web Development", subdepartment: "Backend", experience: 5, uploadDate: "2026-03-24", fileName: "priya_resume.pdf" },
  { id: 3, name: "Amit Kumar", email: "amit@example.com", department: "SAP", subdepartment: "ABAP", experience: 7, uploadDate: "2026-03-23", fileName: "amit_resume.pdf" },
  { id: 4, name: "Sneha Gupta", email: "sneha@example.com", department: "SAP", subdepartment: "FICO", experience: 4, uploadDate: "2026-03-22", fileName: "sneha_resume.pdf" },
  { id: 5, name: "Vikram Singh", email: "vikram@example.com", department: "Web Development", subdepartment: "App Development", experience: 2, uploadDate: "2026-03-21", fileName: "vikram_resume.pdf" },
  { id: 6, name: "Ananya Mishra", email: "ananya@example.com", department: "SAP", subdepartment: "MM", experience: 6, uploadDate: "2026-03-20", fileName: "ananya_resume.pdf" },
];

export const departments = [
  {
    name: "Web Development",
    icon: "Globe",
    subdepartments: ["Frontend", "Backend", "App Development"],
  },
  {
    name: "SAP",
    icon: "Database",
    subdepartments: ["ABAP", "MM", "SD", "FICO"],
  },
];
