/* Shared storage access for Warrigal Park FC. Load team/mockdata.js first. */

const STORE_KEYS = [
  "members",
  "guardians",
  "guardianMembers",
  "registrations",
  "teams",
  "teamMembers"
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getSeedData(key) {
  const seedData = {
    members: typeof members === "undefined" ? [] : members,
    guardians: typeof guardians === "undefined" ? [] : guardians,
    guardianMembers: typeof guardianMembers === "undefined" ? [] : guardianMembers,
    registrations: typeof registrations === "undefined" ? [] : registrations,
    teams: typeof teams === "undefined" ? [] : teams,
    teamMembers: typeof teamMembers === "undefined" ? [] : teamMembers
  };

  return clone(seedData[key] || []);
}

function getStore(key) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue === null ? [] : JSON.parse(savedValue);
  } catch (error) {
    return [];
  }
}

function saveStore(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
}

function initialiseStorage() {
  STORE_KEYS.forEach(function (key) {
    if (localStorage.getItem(key) === null) {
      saveStore(key, getSeedData(key));
    }
  });
}

function resetToMockData() {
  STORE_KEYS.forEach(function (key) {
    saveStore(key, getSeedData(key));
  });
}
