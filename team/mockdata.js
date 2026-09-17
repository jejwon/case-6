// data.js
// WPFC Member Management System
// Mock / Fixed Data for test
/* Mock data for Warrigal Park FC.
   Senior classification is supplied as mock data because
   the case study does not specify a minimum Senior age.
*/

// ## Mock Data Description

// The mock data is based on the requirements and examples provided in the Warrigal Park Football Club case study.

// The data includes members, guardians, guardian-member relationships, registrations, teams, and team memberships. Synthetic names, contact details, and addresses are used for demonstration and testing only.

// ### Data Rules and Assumptions

// * Junior age groups are based on the player's age as at 31 December 2026, following the association's age-group rule.
// * Members under 18 require a linked guardian before their registration can be completed.
// * Members aged 18 or over do not require a guardian.
// * The case study does not specify a minimum age for Senior classification. Therefore, Senior classification is provided as mock data and is not automatically calculated from the member's date of birth.
// * Over 35 classification is also provided as mock data because the case study identifies Over 35 sides but does not provide a calculation rule for this category.
// * Jayden Marsh is included as a special test case because the case study states that he is 17 and is playing seniors in 2026, while the requirement about whether he needs the guardian section is unresolved.
// * No real personal information is used in the mock data.

// The mock data is intended to support the prototype, demonstrate the main system functions, and test registration, guardian, team, and roster requirements.

const members = [
  {
    id: "M001",
    firstName: "Mia",
    lastName: "Carter",
    dateOfBirth: "2014-03-09",
    gender: "Female",
    category: "Junior",
    ageGroup: "U13",
    email: "mia.carter@example.com",
    phone: "0400 100 001",
    address: "10 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M002",
    firstName: "Rory",
    lastName: "Carter",
    dateOfBirth: "2018-07-15",
    gender: "Male",
    category: "Junior",
    ageGroup: "U9",
    email: "rory.carter@example.com",
    phone: "0400 100 002",
    address: "10 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M003",
    firstName: "Ruby",
    lastName: "Evans",
    dateOfBirth: "2014-02-11",
    gender: "Female",
    category: "Junior",
    ageGroup: "U13",
    email: "ruby.evans@example.com",
    phone: "0400 100 003",
    address: "20 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M004",
    firstName: "Harriet",
    lastName: "Brown",
    dateOfBirth: "2014-06-27",
    gender: "Female",
    category: "Junior",
    ageGroup: "U13",
    email: "harriet.brown@example.com",
    phone: "0400 100 004",
    address: "30 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M005",
    firstName: "Noah",
    lastName: "Wilson",
    dateOfBirth: "2013-11-14",
    gender: "Male",
    category: "Junior",
    ageGroup: "U14",
    email: "noah.wilson@example.com",
    phone: "0400 100 005",
    address: "30 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M006",
    firstName: "Chloe",
    lastName: "Martin",
    dateOfBirth: "2014-01-30",
    gender: "Female",
    category: "Junior",
    ageGroup: "U13",
    email: "chloe.martin@example.com",
    phone: "0400 100 006",
    address: "40 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M007",
    firstName: "Isla",
    lastName: "Taylor",
    dateOfBirth: "2014-07-04",
    gender: "Female",
    category: "Junior",
    ageGroup: "U13",
    email: "isla.taylor@example.com",
    phone: "0400 100 007",
    address: "50 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M008",
    firstName: "Liam",
    lastName: "Nguyen",
    dateOfBirth: "2008-05-21",
    gender: "Male",
    category: "Senior",
    ageGroup: "Senior",
    email: "liam.nguyen@example.com",
    phone: "0400 100 008",
    address: "60 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M009",
    firstName: "Olivia",
    lastName: "Smith",
    dateOfBirth: "2007-09-18",
    gender: "Female",
    category: "Senior",
    ageGroup: "Senior",
    email: "olivia.smith@example.com",
    phone: "0400 100 009",
    address: "70 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M010",
    firstName: "Alex",
    lastName: "Smith",
    dateOfBirth: "2007-09-18",
    gender: "Male",
    category: "Senior",
    ageGroup: "Senior",
    email: "alex.smith@example.com",
    phone: "0400 100 010",
    address: "70 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M011",
    firstName: "Ethan",
    lastName: "Johnson",
    dateOfBirth: "1988-04-12",
    gender: "Male",
    category: "Senior",
    ageGroup: "Over 35",
    email: "ethan.johnson@example.com",
    phone: "0400 100 011",
    address: "80 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M012",
    firstName: "Sophie",
    lastName: "Williams",
    dateOfBirth: "1995-12-03",
    gender: "Female",
    category: "Senior",
    ageGroup: "Senior",
    email: "sophie.williams@example.com",
    phone: "0400 100 012",
    address: "90 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M013",
    firstName: "Jack",
    lastName: "Brown",
    dateOfBirth: "1982-08-19",
    gender: "Male",
    category: "Senior",
    ageGroup: "Over 35",
    email: "jack.brown@example.com",
    phone: "0400 100 013",
    address: "100 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M014",
    firstName: "Ava",
    lastName: "Lee",
    dateOfBirth: "2015-10-22",
    gender: "Female",
    category: "Junior",
    ageGroup: "U12",
    email: "ava.lee@example.com",
    phone: "0400 100 014",
    address: "110 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M015",
    firstName: "Daniel",
    lastName: "Kim",
    dateOfBirth: "2012-01-16",
    gender: "Male",
    category: "Junior",
    ageGroup: "U15",
    email: "daniel.kim@example.com",
    phone: "0400 100 015",
    address: "120 Example Street, Bald Hills QLD 4036",
    status: "Active"
  },
  {
    id: "M016",
    firstName: "Jayden",
    lastName: "Marsh",
    dateOfBirth: "2009-05-04",
    gender: "Male",
    category: "Senior",
    ageGroup: "Senior",
    email: "jayden.marsh@example.com",
    phone: "0400 100 016",
    address: "130 Example Street, Bald Hills QLD 4036",
    status: "Active",
    guardianRuleStatus: "Unresolved"
  }
];


const guardians = [
  {
    id: "G001",
    firstName: "Jordan",
    lastName: "Carter",
    email: "jordan.carter@example.com",
    phone: "0410 200 001",
    address: "10 Example Street, Bald Hills QLD 4036"
  },
  {
    id: "G002",
    firstName: "Casey",
    lastName: "Evans",
    email: "casey.evans@example.com",
    phone: "0410 200 002",
    address: "20 Example Street, Bald Hills QLD 4036"
  },
  {
    id: "G003",
    firstName: "Morgan",
    lastName: "Brown",
    email: "morgan.brown@example.com",
    phone: "0410 200 003",
    address: "30 Example Street, Bald Hills QLD 4036"
  },
  {
    id: "G004",
    firstName: "Taylor",
    lastName: "Martin",
    email: "taylor.martin@example.com",
    phone: "0410 200 004",
    address: "40 Example Street, Bald Hills QLD 4036"
  },
  {
    id: "G005",
    firstName: "Riley",
    lastName: "Taylor",
    email: "riley.taylor@example.com",
    phone: "0410 200 005",
    address: "50 Example Street, Bald Hills QLD 4036"
  },
  {
    id: "G006",
    firstName: "Sam",
    lastName: "Lee",
    email: "sam.lee@example.com",
    phone: "0410 200 006",
    address: "110 Example Street, Bald Hills QLD 4036"
  }
];


const guardianMembers = [
  {
    id: "GM001",
    guardianId: "G001",
    memberId: "M001",
    relationship: "Parent"
  },
  {
    id: "GM002",
    guardianId: "G001",
    memberId: "M002",
    relationship: "Parent"
  },
  {
    id: "GM003",
    guardianId: "G002",
    memberId: "M003",
    relationship: "Parent"
  },
  {
    id: "GM004",
    guardianId: "G003",
    memberId: "M004",
    relationship: "Parent"
  },
  {
    id: "GM005",
    guardianId: "G003",
    memberId: "M005",
    relationship: "Parent"
  },
  {
    id: "GM006",
    guardianId: "G004",
    memberId: "M006",
    relationship: "Parent"
  },
  {
    id: "GM007",
    guardianId: "G005",
    memberId: "M007",
    relationship: "Parent"
  },
  {
    id: "GM008",
    guardianId: "G006",
    memberId: "M014",
    relationship: "Parent"
  }
];


const registrations = [
  {
    id: "R001",
    memberId: "M001",
    season: 2026,
    ageGroup: "U13",
    status: "Complete"
  },
  {
    id: "R002",
    memberId: "M002",
    season: 2026,
    ageGroup: "U9",
    status: "Complete"
  },
  {
    id: "R003",
    memberId: "M003",
    season: 2026,
    ageGroup: "U13",
    status: "Complete"
  },
  {
    id: "R004",
    memberId: "M004",
    season: 2026,
    ageGroup: "U13",
    status: "Complete"
  },
  {
    id: "R005",
    memberId: "M005",
    season: 2026,
    ageGroup: "U14",
    status: "Complete"
  },
  {
    id: "R006",
    memberId: "M006",
    season: 2026,
    ageGroup: "U13",
    status: "Complete"
  },
  {
    id: "R007",
    memberId: "M007",
    season: 2026,
    ageGroup: "U13",
    status: "Complete"
  },
  {
    id: "R008",
    memberId: "M008",
    season: 2026,
    ageGroup: "Senior",
    status: "Complete"
  },
  {
    id: "R009",
    memberId: "M009",
    season: 2026,
    ageGroup: "Senior",
    status: "Complete"
  },
  {
    id: "R010",
    memberId: "M010",
    season: 2026,
    ageGroup: "Senior",
    status: "Complete"
  },
  {
    id: "R011",
    memberId: "M011",
    season: 2026,
    ageGroup: "Over 35",
    status: "Complete"
  },
  {
    id: "R012",
    memberId: "M012",
    season: 2026,
    ageGroup: "Senior",
    status: "Complete"
  },
  {
    id: "R013",
    memberId: "M013",
    season: 2026,
    ageGroup: "Over 35",
    status: "Complete"
  },
  {
    id: "R014",
    memberId: "M014",
    season: 2026,
    ageGroup: "U12",
    status: "Complete"
  },
  {
    id: "R015",
    memberId: "M015",
    season: 2026,
    ageGroup: "U15",
    status: "Started"
  },
  {
    id: "R016",
    memberId: "M016",
    season: 2026,
    ageGroup: "Senior",
    status: "Started",
    guardianRuleStatus: "Unresolved"
  }
];


const teams = [
  {
    id: "T001",
    season: 2026,
    name: "U13G Navy",
    ageGroup: "U13",
    gender: "Female"
  },
  {
    id: "T002",
    season: 2026,
    name: "U14 Boys",
    ageGroup: "U14",
    gender: "Male"
  },
  {
    id: "T003",
    season: 2026,
    name: "U15 Boys",
    ageGroup: "U15",
    gender: "Male"
  },
  {
    id: "T004",
    season: 2026,
    name: "Senior Men",
    ageGroup: "Senior",
    gender: "Male"
  },
  {
    id: "T005",
    season: 2026,
    name: "Senior Women",
    ageGroup: "Senior",
    gender: "Female"
  },
  {
    id: "T006",
    season: 2026,
    name: "Over 35 Men",
    ageGroup: "Over 35",
    gender: "Male"
  }
];


const teamMembers = [
  {
    id: "TM001",
    teamId: "T001",
    memberId: "M001",
    registrationId: "R001"
  },
  {
    id: "TM002",
    teamId: "T001",
    memberId: "M003",
    registrationId: "R003"
  },
  {
    id: "TM003",
    teamId: "T001",
    memberId: "M004",
    registrationId: "R004"
  },
  {
    id: "TM004",
    teamId: "T001",
    memberId: "M006",
    registrationId: "R006"
  },
  {
    id: "TM005",
    teamId: "T001",
    memberId: "M007",
    registrationId: "R007"
  },
  {
    id: "TM006",
    teamId: "T002",
    memberId: "M005",
    registrationId: "R005"
  },
  {
    id: "TM007",
    teamId: "T003",
    memberId: "M015",
    registrationId: "R015"
  },
  {
    id: "TM008",
    teamId: "T004",
    memberId: "M008",
    registrationId: "R008"
  },
  {
    id: "TM009",
    teamId: "T004",
    memberId: "M010",
    registrationId: "R010"
  },
  {
    id: "TM010",
    teamId: "T005",
    memberId: "M009",
    registrationId: "R009"
  },
  {
    id: "TM011",
    teamId: "T005",
    memberId: "M012",
    registrationId: "R012"
  },
  {
    id: "TM012",
    teamId: "T006",
    memberId: "M011",
    registrationId: "R011"
  },
  {
    id: "TM013",
    teamId: "T006",
    memberId: "M013",
    registrationId: "R013"
  }
];