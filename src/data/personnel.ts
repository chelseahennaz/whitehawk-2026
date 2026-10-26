export interface StaffMember {
  name: string;
  role: string;
}

export interface Department {
  title: string;
  members: StaffMember[];
  type: "football" | "club";
}

export const personnelData: Department[] = [
  {
    title: "Club Executives",
    type: "club",
    members: [
      { name: "John Summers", role: "Chairman" },
      { name: "Ned McDonnell", role: "Chairman" },
      { name: "Nigel Thornton", role: "Vice-Chairman & General Manager" },
      { name: "Henry Summers", role: "Assistant to Chairman & Digital Operations Manager" },
    ],
  },
  {
    title: "Team Staff",
    type: "football",
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
    type: "club",
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
    type: "club",
    members: [
      { name: "Anthony Scott", role: "Programme Editor" },
      { name: "Regine Thornton", role: "Bar Manager" },
      { name: "John Clive", role: "Tunnel Coordinator" },
      { name: "Elaine Parker", role: "Turnstiles" },
    ],
  },
  {
    title: "Commercial & Marketing",
    type: "club",
    members: [
      { name: "Mike Youles", role: "Commercial" },
      { name: "Charlotte Summers", role: "Commercial" },
    ],
  },
];
