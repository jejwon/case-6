/* Guardian business functions. */

function getAllGuardians() {
  return getStore("guardians");
}

function getGuardianById(guardianId) {
  return getAllGuardians().find(function (guardian) {
    return guardian.guardianId === Number(guardianId);
  }) || null;
}

function searchGuardiansByName(name) {
  const searchTerm = String(name || "").trim().toLowerCase();

  return getAllGuardians().filter(function (guardian) {
    const fullName = (guardian.firstName + " " + guardian.lastName).toLowerCase();
    return fullName.includes(searchTerm);
  });
}

function addGuardian(guardianData) {
  const guardians = getAllGuardians();

  const nextId = Math.max.apply(null, guardians.map(function (guardian) {
    return guardian.guardianId;
  }).concat([0])) + 1;

  const guardian = {
    guardianId: nextId,
    firstName: String(guardianData.firstName || "").trim(),
    lastName: String(guardianData.lastName || "").trim(),
    mobile: String(guardianData.mobile || "").trim(),
    email: String(guardianData.email || "").trim(),
    address: String(guardianData.address || "").trim()
  };

  guardians.push(guardian);

  if (!saveStore("guardians", guardians)) {
    throw new Error("Guardian information could not be saved.");
  }

  return guardian;
}

function linkGuardianToMember(guardianId, memberId) {
  const guardians = getAllGuardians();
  const guardianMembers = getStore("guardianMembers");

  const guardianExists = guardians.some(function (guardian) {
    return guardian.guardianId === Number(guardianId);
  });

  if (!guardianExists) {
    throw new Error("Guardian not found.");
  }

  const memberExists = getStore("members").some(function (member) {
    return member.memberId === Number(memberId);
  });

  if (!memberExists) {
    throw new Error("Junior member not found.");
  }

  const alreadyLinked = guardianMembers.some(function (link) {
    return (
      link.guardianId === Number(guardianId) &&
      link.memberId === Number(memberId)
    );
  });

  if (alreadyLinked) {
    return false;
  }

  guardianMembers.push({
    guardianId: Number(guardianId),
    memberId: Number(memberId)
  });

  if (!saveStore("guardianMembers", guardianMembers)) {
    throw new Error("Guardian-Junior link could not be saved.");
  }

  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  initialiseStorage();

  const addForm = document.getElementById("add-guardian-form");

  addForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(addForm);

    const guardian = addGuardian({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      mobile: formData.get("mobile"),
      email: formData.get("email"),
      address: formData.get("address")
    });

    document.getElementById("form-message").textContent =
      "Guardian added successfully. Guardian ID: " + guardian.guardianId;

    addForm.reset();
  });


  const linkForm = document.getElementById("link-guardian-form");

  linkForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const guardianId = document.getElementById("guardian-id").value;
    const memberId = document.getElementById("member-id").value;

    const linked = linkGuardianToMember(guardianId, memberId);

    document.getElementById("link-message").textContent =
      linked
        ? "Guardian linked to junior successfully."
        : "This guardian is already linked to this junior.";
  });
});