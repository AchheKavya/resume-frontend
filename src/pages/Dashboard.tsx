import { mockResumes } from "@/data/mockData";
import { FileText, Clock, Globe, Database } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Total Resumes", value: 6, icon: FileText, color: "text-primary" },
  { label: "Recent Files", value: 3, icon: Clock, color: "text-warning" },
  { label: "Web Dev", value: 3, icon: Globe, color: "text-success" },
  { label: "SAP", value: 3, icon: Database, color: "text-accent-foreground" },
];

const Dashboard = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-bold font-heading text-foreground">Dashboard</h1>
      <p className="text-muted-foreground mt-1">Overview of your resume management</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className="stat-card flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${s.color}`}>
            <s.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold font-heading text-foreground">{s.value}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold font-heading text-foreground">Uploaded Resumes</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Subdepartment</TableHead>
              <TableHead>Exp (yrs)</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockResumes.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell><Badge variant="secondary">{r.department}</Badge></TableCell>
                <TableCell>{r.subdepartment}</TableCell>
                <TableCell>{r.experience}</TableCell>
                <TableCell className="text-muted-foreground">{r.uploadDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
);

export default Dashboard;
