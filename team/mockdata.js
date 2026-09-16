// data.js
// WPFC Member Management System
// Mock / Fixed Data for test

const members = [
  {
    memberId: 1,
    firstName: "Liam",
    lastName: "Smith",
    dateOfBirth: "2014-05-12",
    gender: "Male",
    phone: "0400 000 001",
    email: "liam.smith@example.com",
    status: "Active"
  },
  {
    memberId: 2,
    firstName: "Emma",
    lastName: "Smith",
    dateOfBirth: "2013-08-20",
    gender: "Female",
    phone: "0400 000 002",
    email: "emma.smith@example.com",
    status: "Active"
  },
  {
    memberId: 3,
    firstName: "Noah",
    lastName: "Brown",
    dateOfBirth: "2014-03-15",
    gender: "Male",
    phone: "0400 000 003",
    email: "noah.brown@example.com",
    status: "Active"
  },
  {
    memberId: 4,
    firstName: "Olivia",
    lastName: "Jones",
    dateOfBirth: "2013-11-02",
    gender: "Female",
    phone: "0400 000 004",
    email: "olivia.jones@example.com",
    status: "Active"
  },
  {
    memberId: 5,
    firstName: "Jack",
    lastName: "Wilson",
    dateOfBirth: "2012-06-18",
    gender: "Male",
    phone: "0400 000 005",
    email: "jack.wilson@example.com",
    status: "Active"
  },
  {
    memberId: 6,
    firstName: "Ava",
    lastName: "Taylor",
    dateOfBirth: "2011-09-25",
    gender: "Female",
    phone: "0400 000 006",
    email: "ava.taylor@example.com",
    status: "Active"
  },
  {
    memberId: 7,
    firstName: "Ethan",
    lastName: "Miller",
    dateOfBirth: "2008-02-14",
    gender: "Male",
    phone: "0400 000 007",
    email: "ethan.miller@example.com",
    status: "Active"
  },
  {
    memberId: 8,
    firstName: "Sophie",
    lastName: "Davis",
    dateOfBirth: "2006-07-30",
    gender: "Female",
    phone: "0400 000 008",
    email: "sophie.davis@example.com",
    status: "Active"
  },
  {
    // Same name as member 10 for search/duplicate testing
    memberId: 9,
    firstName: "James",
    lastName: "Lee",
    dateOfBirth: "2014-04-10",
    gender: "Male",
    phone: "0400 000 009",
    email: "james.lee1@example.com",
    status: "Active"
  },
  {
    // Same name as member 9 for duplicate search testing
    memberId: 10,
    firstName: "James",
    lastName: "Lee",
    dateOfBirth: "2013-12-05",
    gender: "Male",
    phone: "0400 000 010",
    email: "james.lee2@example.com",
    status: "Active"
  },
  {
    memberId: 11,
    firstName: "Mia",
    lastName: "Anderson",
    dateOfBirth: "2015-01-22",
    gender: "Female",
    phone: "0400 000 011",
    email: "mia.anderson@example.com",
    status: "Active"
  },
  {
    memberId: 12,
    firstName: "Daniel",
    lastName: "Thomas",
    dateOfBirth: "2004-10-17",
    gender: "Male",
    phone: "0400 000 012",
    email: "daniel.thomas@example.com",
    status: "Active"
  }
];


const guardians = [
  {
    guardianId: 1,
    firstName: "Sarah",
    lastName: "Smith",
    mobile: "0410 000 001",
    email: "sarah.smith@example.com",
    address: "Brisbane"
  },
  {
    guardianId: 2,
    firstName: "Michael",
    lastName: "Brown",
    mobile: "0410 000 002",
    email: "michael.brown@example.com",
    address: "Bald Hills"
  },
  {
    guardianId: 3,
    firstName: "Emily",
    lastName: "Jones",
    mobile: "0410 000 003",
    email: "emily.jones@example.com",
    address: "Bracken Ridge"
  },
  {
    guardianId: 4,
    firstName: "David",
    lastName: "Wilson",
    mobile: "0410 000 004",
    email: "david.wilson@example.com",
    address: "Aspley"
  },
  {
    guardianId: 5,
    firstName: "Rachel",
    lastName: "Taylor",
    mobile: "0410 000 005",
    email: "rachel.taylor@example.com",
    address: "Carseldine"
  },
  {
    guardianId: 6,
    firstName: "James",
    lastName: "Lee",
    mobile: "0410 000 006",
    email: "james.lee.parent@example.com",
    address: "Albany Creek"
  },
  {
    guardianId: 7,
    firstName: "Laura",
    lastName: "Anderson",
    mobile: "0410 000 007",
    email: "laura.anderson@example.com",
    address: "Mango Hill"
  }
];


const guardianMembers = [
  // Sarah Smith is guardian of two juniors
  {
    guardianId: 1,
    memberId: 1,
    relationship: "Mother"
  },
  {
    guardianId: 1,
    memberId: 2,
    relationship: "Mother"
  },

  {
    guardianId: 2,
    memberId: 3,
    relationship: "Father"
  },

  {
    guardianId: 3,
    memberId: 4,
    relationship: "Mother"
  },

  {
    guardianId: 4,
    memberId: 5,
    relationship: "Father"
  },

  {
    guardianId: 5,
    memberId: 6,
    relationship: "Mother"
  },

  {
    guardianId: 6,
    memberId: 9,
    relationship: "Father"
  },
  {
    guardianId: 6,
    memberId: 10,
    relationship: "Father"
  },

  {
    guardianId: 7,
    memberId: 11,
    relationship: "Mother"
  }
];


const registrations = [
  {
    registrationId: 1,
    memberId: 1,
    season: "2026",
    ageGroup: "U13 Girls",
    status: "Complete"
  },
  {
    registrationId: 2,
    memberId: 2,
    season: "2026",
    ageGroup: "U13 Girls",
    status: "Complete"
  },
  {
    registrationId: 3,
    memberId: 3,
    season: "2026",
    ageGroup: "U13 Boys",
    status: "Complete"
  },
  {
    registrationId: 4,
    memberId: 4,
    season: "2026",
    ageGroup: "U13 Girls",
    status: "Complete"
  },
  {
    registrationId: 5,
    memberId: 5,
    season: "2026",
    ageGroup: "U15 Boys",
    status: "Complete"
  },
  {
    registrationId: 6,
    memberId: 6,
    season: "2026",
    ageGroup: "U15 Girls",
    status: "Complete"
  },
  {
    registrationId: 7,
    memberId: 7,
    season: "2026",
    ageGroup: "U18 Boys",
    status: "Complete"
  },
  {
    registrationId: 8,
    memberId: 8,
    season: "2026",
    ageGroup: "U18 Girls",
    status: "Complete"
  },

  // Duplicate-name members
  {
    registrationId: 9,
    memberId: 9,
    season: "2026",
    ageGroup: "U13 Boys",
    status: "Complete"
  },
  {
    registrationId: 10,
    memberId: 10,
    season: "2026",
    ageGroup: "U13 Boys",
    status: "Started"
  },

  {
    registrationId: 11,
    memberId: 11,
    season: "2026",
    ageGroup: "U12 Girls",
    status: "Complete"
  },

  // Senior - no guardian required
  {
    registrationId: 12,
    memberId: 12,
    season: "2026",
    ageGroup: "Senior Men",
    status: "Complete"
  },

  // Previous season example for registration history
  {
    registrationId: 13,
    memberId: 1,
    season: "2025",
    ageGroup: "U12 Girls",
    status: "Complete"
  },

  {
    registrationId: 14,
    memberId: 5,
    season: "2025",
    ageGroup: "U14 Boys",
    status: "Withdrawn"
  }
];


const teams = [
  {
    teamId: 1,
    teamName: "U13G Navy",
    season: "2026",
    ageGroup: "U13 Girls"
  },
  {
    teamId: 2,
    teamName: "U13G Gold",
    season: "2026",
    ageGroup: "U13 Girls"
  },
  {
    teamId: 3,
    teamName: "U13B Navy",
    season: "2026",
    ageGroup: "U13 Boys"
  },
  {
    teamId: 4,
    teamName: "U15 Boys",
    season: "2026",
    ageGroup: "U15 Boys"
  },
  {
    teamId: 5,
    teamName: "U15 Girls",
    season: "2026",
    ageGroup: "U15 Girls"
  },
  {
    // Empty team for empty-roster testing
    teamId: 6,
    teamName: "U18 Girls",
    season: "2026",
    ageGroup: "U18 Girls"
  }
];


const teamMembers = [
  // U13G Navy
  {
    teamId: 1,
    memberId: 1
  },
  {
    teamId: 1,
    memberId: 2
  },

  // U13G Gold
  {
    teamId: 2,
    memberId: 4
  },

  // U13B Navy
  {
    teamId: 3,
    memberId: 3
  },
  {
    teamId: 3,
    memberId: 9
  },

  // U15 Boys
  {
    teamId: 4,
    memberId: 5
  },

  // U15 Girls
  {
    teamId: 5,
    memberId: 6
  }

  // Team 6 intentionally has no members
];