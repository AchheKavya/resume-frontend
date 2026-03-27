import { useState } from "react";
import { departments } from "@/data/mockData";
import { Globe, Database, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, typeof Globe> = { Globe, Database };

const Departments = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const dept = departments.find(d => d.name === selected);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Departments</h1>
        <p className="text-muted-foreground mt-1">Browse by department and subdepartment</p>
      </div>

      {!selected ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map(d => {
            const Icon = iconMap[d.icon] || Globe;
            return (
              <div
                key={d.name}
                className="dept-card group"
                onClick={() => setSelected(d.name)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-semibold font-heading text-foreground">{d.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{d.subdepartments.length} subdepartments</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {d.subdepartments.map(s => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <Button variant="ghost" className="mb-6 text-muted-foreground" onClick={() => setSelected(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to departments
          </Button>
          <h2 className="text-xl font-bold font-heading text-foreground mb-4">{dept?.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dept?.subdepartments.map(s => (
              <div key={s} className="dept-card">
                <h3 className="text-lg font-semibold font-heading text-foreground">{s}</h3>
                <p className="text-sm text-muted-foreground mt-1">View resumes under {s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
