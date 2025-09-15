// Mock User Service for teammate assignment
// This will be replaced with ApperClient integration when user table is available

const mockUsers = [
  {
    Id: 1,
    Name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Project Manager",
    avatar: "SJ"
  },
  {
    Id: 2,
    Name: "Mike Chen",
    email: "mike.chen@company.com", 
    role: "Developer",
    avatar: "MC"
  },
  {
    Id: 3,
    Name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Designer", 
    avatar: "ED"
  },
  {
    Id: 4,
    Name: "Alex Rodriguez",
    email: "alex.rodriguez@company.com",
    role: "Developer",
    avatar: "AR"
  },
  {
    Id: 5,
    Name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    role: "QA Engineer",
    avatar: "LT"
  },
  {
    Id: 6,
    Name: "David Kim",
    email: "david.kim@company.com",
    role: "DevOps",
    avatar: "DK"
  },
  {
    Id: 7,
    Name: "Rachel Green",
    email: "rachel.green@company.com",
    role: "Business Analyst",
    avatar: "RG"
  },
  {
    Id: 8,
    Name: "Tom Wilson",
    email: "tom.wilson@company.com",
    role: "Team Lead",
    avatar: "TW"
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(200);
    return [...mockUsers];
  },

  async getById(id) {
    await delay(200);
    const user = mockUsers.find(user => user.Id === parseInt(id));
    return user ? {...user} : null;
  }
};