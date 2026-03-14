import { Users, Briefcase, Megaphone, Settings, Shield } from "lucide-react";

interface StaffMember {
  name: string;
  role: string;
}

interface Department {
  title: string;
  icon: React.ReactNode;
  members: StaffMember[];
}

const departments: Department[] = [
  {
    title: "Club Executives",
    icon: <Briefcase size={18} />,
    members: [
      { name: "John Summers", role: "Chairman" },
      { name: "Ned McDonnell", role: "Chairman" },
      { name: "Nigel Thornton", role: "Vice-Chairman & General Manager" },
      { name: "Henry Summers", role: "Assistant to Chairman & Digital Operations Manager" },
    ],
  },
  {
    title: "Team Staff",
    icon: <Shield size={18} />,
    members: [
      { name: "Shaun Saunders", role: "Men's First Team Manager" },
      { name: "Will Hendon", role: "Men's First Team Assistant Manager" },
      { name: "Roy Staunton", role: "Men's First Team Assistant Manager" },
      { name: "Alex Walsh", role: "Men's First Team Coach" },
      { name: "Kevin Mottley", role: "Men's First Team Fitness/Conditioning Coach" },
      { name: "Velichka Atanasova", role: "Men's First Team Physio" },
      { name: "Ian Hickley-Smith", role: "Women's First Team Manager" },
      { name: "George Parris", role: "Women's First Team Registration Officer" },
    ],
  },
  {
    title: "Club Operations",
    icon: <Settings size={18} />,
    members: [
      { name: "John Rosenblatt", role: "Secretary & Treasurer" },
      { name: "Andy Schofield", role: "President, Photographer & Historian" },
      { name: "Kay Stringer", role: "Assistant Secretary, School Liaison Officer, Welfare Officer & Registration Secretary" },
      { name: "Adam Hart", role: "Match Secretary" },
      { name: "Keith Collingbourne", role: "Groundsman" },
      { name: "Simon Chandler", role: "Ground & Office Assistant" },
    ],
  },
  {
    title: "Matchday Operations",
    icon: <Users size={18} />,
    members: [
      { name: "Anthony Scott", role: "Programme Editor" },
      { name: "Regine Thornton", role: "Bar Manager" },
      { name: "John Clive", role: "Tunnel Coordinator" },
      { name: "Elaine Parker", role: "Turnstiles" },
    ],
  },
  {
    title: "Commercial & Marketing",
    icon: <Megaphone size={18} />,
    members: [
      { name: "Mike Youles", role: "Commercial" },
      { name: "Charlotte Summers", role: "Commercial" },
    ],
  },
];

const ClubPersonnel = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <p className="font-heading text-sm uppercase tracking-widest text-club-gold mb-1">Behind The Scenes</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase text-foreground mb-8">
          Club Personnel
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.title}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="bg-club-dark px-5 py-3 flex items-center gap-2 text-primary-foreground">
                {dept.icon}
                <h3 className="font-heading text-sm font-bold uppercase tracking-wide">
                  {dept.title}
                </h3>
              </div>
              <div className="divide-y divide-border">
                {dept.members.map((member) => (
                  <div key={member.name} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="font-heading text-[10px] font-bold text-muted-foreground">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading text-sm font-bold text-foreground truncate">
                        {member.name}
                      </p>
                      <p className="font-body text-[11px] text-muted-foreground leading-tight">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubPersonnel;
