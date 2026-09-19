/* Season registration business functions. Load team/mockdata.js and data.js first. */

function getRegistrationsByMember(memberId) {
  const id = String(memberId || "").trim();

  return getStore("registrations").filter(function (registration) {
    return registration.memberId === id;
  });
}

function getRegistrationById(registrationId) {
  const id = String(registrationId || "").trim();

  return getStore("registrations").find(function (registration) {
    return registration.id === id;
  }) || null;
}

function memberExists(memberId) {
  const id = String(memberId || "").trim();

  return getStore("members").some(function (member) {
    return member.id === id;
  });
}

function getRegistrationMember(memberId) {
  const id = String(memberId || "").trim();

  return getStore("members").find(function (member) {
    return member.id === id;
  }) || null;
}

function normaliseSeason(season) {
  const parsedSeason = Number(String(season || "").trim());
  return Number.isInteger(parsedSeason) && parsedSeason > 0 ? parsedSeason : null;
}

function nextRegistrationId(registrations) {
  const nextNumber = registrations.reduce(function (max, registration) {
    const match = String(registration.id || "").match(/^R(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;

  return "R" + String(nextNumber).padStart(3, "0");
}

function calculateCurrentAge(dateOfBirth) {
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateOfBirth || ""));
  if (!dateParts) {
    return null;
  }

  const birthYear = Number(dateParts[1]);
  const birthMonth = Number(dateParts[2]) - 1;
  const birthDay = Number(dateParts[3]);
  const birthday = new Date(birthYear, birthMonth, birthDay);

  if (birthday.getFullYear() !== birthYear ||
      birthday.getMonth() !== birthMonth ||
      birthday.getDate() !== birthDay) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (birthday > today) {
    return null;
  }

  let age = today.getFullYear() - birthYear;
  const birthdayHasNotOccurred = today.getMonth() < birthMonth ||
    (today.getMonth() === birthMonth && today.getDate() < birthDay);

  if (birthdayHasNotOccurred) {
    age -= 1;
  }

  return age;
}

function getAutomaticAgeGroup(member) {
  if (!member) {
    return null;
  }

  const age = calculateCurrentAge(member.dateOfBirth);
  if (age === null) {
    return null;
  }

  if (age >= 18) {
    return "Senior";
  }

  if (member.gender === "Male") {
    return "U" + age + " Boys";
  }

  if (member.gender === "Female") {
    return "U" + age + " Girls";
  }

  return null;
}

function getAgeGroupValidationMessage(memberId) {
  const member = getRegistrationMember(memberId);

  if (!member) {
    return "Select a member before creating a registration.";
  }

  if (member.status === "Inactive") {
    return "Inactive members cannot be registered.";
  }

  if (calculateCurrentAge(member.dateOfBirth) === null) {
    return "The selected member needs a valid date of birth before registration can be created.";
  }

  if (getAutomaticAgeGroup(member) === null) {
    return "The selected member needs Gender set to Male or Female before registration can be created.";
  }

  return "Registration details are invalid.";
}

function createRegistration(memberId, season, ageGroup) {
  const memberIdString = String(memberId || "").trim();
  const cleanSeason = normaliseSeason(season);
  const registrations = getStore("registrations");
  const member = getRegistrationMember(memberIdString);
  const generatedAgeGroup = getAutomaticAgeGroup(member);

  if (!memberExists(memberIdString) ||
      !member ||
      member.status === "Inactive" ||
      cleanSeason === null ||
      !generatedAgeGroup) {
    return null;
  }

  const alreadyRegistered = registrations.some(function (registration) {
    return registration.memberId === memberIdString && registration.season === cleanSeason;
  });

  if (alreadyRegistered) {
    return null;
  }

  const registrationId = nextRegistrationId(registrations);

  registrations.push({
    id: registrationId,
    memberId: memberIdString,
    season: cleanSeason,
    ageGroup: generatedAgeGroup,
    status: "Started"
  });

  return saveStore("registrations", registrations) ? registrationId : null;
}

function updateRegistration(registrationId, updatedFields) {
  const registrations = getStore("registrations");
  const id = String(registrationId || "").trim();
  const registrationIndex = registrations.findIndex(function (registration) {
    return registration.id === id;
  });

  if (registrationIndex === -1) {
    return false;
  }

  const hasSeason = Object.prototype.hasOwnProperty.call(updatedFields, "season");
  if (!hasSeason) {
    return false;
  }

  const registration = registrations[registrationIndex];
  const season = hasSeason ? normaliseSeason(updatedFields.season) : registration.season;
  const ageGroup = getAutomaticAgeGroup(getRegistrationMember(registration.memberId));

  if (season === null || !ageGroup) {
    return false;
  }

  const wouldDuplicateSeason = registrations.some(function (item) {
    return item.id !== registration.id &&
      item.memberId === registration.memberId &&
      item.season === season;
  });

  if (wouldDuplicateSeason) {
    return false;
  }

  registration.season = season;
  registration.ageGroup = ageGroup;
  return saveStore("registrations", registrations);
}

function withdrawRegistration(registrationId) {
  const registrations = getStore("registrations");
  const id = String(registrationId || "").trim();
  const registration = registrations.find(function (item) {
    return item.id === id;
  });

  if (!registration) {
    return false;
  }

  registration.status = "Withdrawn";
  return saveStore("registrations", registrations);
}

function completeRegistration(registrationId) {
  const registrations = getStore("registrations");
  const id = String(registrationId || "").trim();
  const registration = registrations.find(function (item) {
    return item.id === id;
  });

  if (!registration) {
    return { success: false, reason: "Registration not found." };
  }

  if (registration.status === "Complete") {
    return { success: false, reason: "Registration is already complete." };
  }

  if (registration.status === "Withdrawn") {
    return { success: false, reason: "Withdrawn registrations cannot be completed." };
  }

  if (registration.status !== "Started") {
    return { success: false, reason: "Only started registrations can be completed." };
  }

  const member = getRegistrationMember(registration.memberId);
  if (member && member.status === "Inactive") {
    return { success: false, reason: "Inactive members cannot complete registration." };
  }

  const age = member ? calculateCurrentAge(member.dateOfBirth) : null;

  if (age === null) {
    return {
      success: false,
      reason: "The member needs a valid date of birth before registration can be completed."
    };
  }

  if (age < 18 && getGuardiansForMember(registration.memberId).length === 0) {
    return { success: false, reason: "Guardian required for junior registration" };
  }

  registration.status = "Complete";
  if (!saveStore("registrations", registrations)) {
    return { success: false, reason: "Registration could not be completed." };
  }

  return { success: true, reason: null };
}

function getRegistrationStatus(memberId, season) {
  const memberIdString = String(memberId || "").trim();
  const cleanSeason = normaliseSeason(season);
  if (cleanSeason === null) {
    return null;
  }

  const registration = getStore("registrations").find(function (item) {
    return item.memberId === memberIdString && item.season === cleanSeason;
  });

  return registration ? registration.status : null;
}

function getMemberName(memberId) {
  const id = String(memberId || "").trim();

  const member = getStore("members").find(function (item) {
    return item.id === id;
  });

  return member ? member.firstName + " " + member.lastName : "Member #" + memberId;
}

function createRegistrationCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function registrationStatusClass(status) {
  return "status status-" + String(status).toLowerCase();
}

function renderRegistrationList(selectedRegistrationId) {
  const listBody = document.querySelector("#registration-list");
  const totalRegistrations = document.querySelector("#total-registrations");

  if (!listBody || !totalRegistrations) {
    return;
  }

  const registrations = getStore("registrations");
  listBody.replaceChildren();
  totalRegistrations.textContent = registrations.length;

  if (registrations.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "empty-state";
    cell.textContent = "No registrations found.";
    row.appendChild(cell);
    listBody.appendChild(row);
    return;
  }

  registrations.forEach(function (registration) {
    const row = document.createElement("tr");
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", "View registration for " + getMemberName(registration.memberId));

    if (registration.id === String(selectedRegistrationId || "").trim()) {
      row.className = "selected-row";
    }

    const memberCell = createRegistrationCell(getMemberName(registration.memberId));
    memberCell.className = "member-name";
    row.appendChild(memberCell);
    row.appendChild(createRegistrationCell(registration.season));
    row.appendChild(createRegistrationCell(registration.ageGroup));

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = registrationStatusClass(registration.status);
    status.textContent = registration.status;
    statusCell.appendChild(status);
    row.appendChild(statusCell);

    function selectRegistration() {
      showRegistrationDetails(registration.id);
      renderRegistrationList(registration.id);
    }

    row.addEventListener("click", selectRegistration);
    row.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectRegistration();
      }
    });
    listBody.appendChild(row);
  });
}

function showRegistrationDetails(registrationId, notice, isError) {
  const details = document.querySelector("#registration-details");
  const registration = getRegistrationById(registrationId);

  if (!details || !registration) {
    return;
  }

  details.replaceChildren();

  const profile = document.createElement("div");
  profile.className = "profile-section";

  const title = document.createElement("h3");
  title.className = "member-name";
  title.textContent = getMemberName(registration.memberId);

  const metaBadges = document.createElement("div");
  metaBadges.className = "meta-badges";

  const id = document.createElement("span");
  id.className = "badge";
  id.textContent = "Registration ID #" + registration.id;

  const member = document.createElement("span");
  member.className = "badge";
  member.textContent = "Member ID #" + registration.memberId;

  metaBadges.append(id, member);
  profile.append(title, metaBadges);

  const form = document.createElement("form");
  form.className = "edit-registration-form";
  form.innerHTML =
    '<div class="field form-group"><label for="edit-season">Season <span aria-hidden="true">*</span></label><input class="form-control" id="edit-season" name="season" type="text" required></div>' +
    '<div class="field form-group"><label for="edit-age-group">Age group</label><input class="form-control" id="edit-age-group" name="ageGroup" type="text" readonly aria-readonly="true"></div>' +
    '<div class="registration-status status-row"><span class="status-label">Status</span><strong class="' + registrationStatusClass(registration.status) + '">' + registration.status + '</strong></div>' +
    '<p class="form-message" aria-live="polite"></p>' +
    '<div class="action-buttons"><button class="secondary-button" type="submit">Update Registration</button></div>';

  form.elements.season.value = registration.season;
  form.elements.ageGroup.value = registration.ageGroup;
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    if (!updateRegistration(registration.id, {
      season: form.elements.season.value
    })) {
      const generatedAgeGroup = getAutomaticAgeGroup(getRegistrationMember(registration.memberId));
      const errorMessage = generatedAgeGroup ?
        "Registration changes could not be saved. A registration for this member and season may already exist." :
        getAgeGroupValidationMessage(registration.memberId);
      showRegistrationDetails(registration.id, errorMessage, true);
      return;
    }

    showRegistrationDetails(registration.id, "Registration changes saved.");
    renderRegistrationList(registration.id);
  });

  const actions = form.querySelector(".action-buttons");
  if (registration.status === "Started") {
    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "primary-button";
    completeButton.textContent = "Complete Registration";
    completeButton.addEventListener("click", function () {
      const result = completeRegistration(registration.id);
      showRegistrationDetails(
        registration.id,
        result.success ? "Registration completed." : result.reason,
        !result.success
      );

      if (result.success) {
        renderRegistrationList(registration.id);
      }
    });
    actions.prepend(completeButton);
  }

  if (registration.status !== "Withdrawn") {
    const withdrawButton = document.createElement("button");
    withdrawButton.type = "button";
    withdrawButton.className = "danger-button";
    withdrawButton.textContent = "Withdraw Registration";
    withdrawButton.addEventListener("click", function () {
      if (withdrawRegistration(registration.id)) {
        showRegistrationDetails(registration.id, "Registration withdrawn.");
        renderRegistrationList(registration.id);
      }
    });
    actions.appendChild(withdrawButton);
  }

  if (notice) {
    const message = form.querySelector(".form-message");
    message.className = "form-message alert-banner " +
      (isError ? "alert-warning" : "alert-success");
    message.textContent = notice;
  }

  details.append(profile, form);
}

function populateMemberOptions() {
  const select = document.querySelector("#registration-member");
  if (!select) {
    return;
  }

  getStore("members").filter(function (member) {
    return member.status === "Active";
  }).forEach(function (member) {
    const option = document.createElement("option");
    option.value = member.id;
    option.textContent = member.firstName + " " + member.lastName + " (Member ID #" + member.id + ")";
    select.appendChild(option);
  });
}

function updateRegistrationAgeGroupField() {
  const memberSelect = document.querySelector("#registration-member");
  const ageGroupInput = document.querySelector("#registration-age-group");
  const message = document.querySelector("#create-registration-message");

  if (!memberSelect || !ageGroupInput || !message) {
    return false;
  }

  if (!memberSelect.value) {
    ageGroupInput.value = "";
    message.textContent = "";
    message.className = "form-message";
    return false;
  }

  const selectedMember = getRegistrationMember(memberSelect.value);
  if (selectedMember && selectedMember.status === "Inactive") {
    ageGroupInput.value = "";
    message.textContent = getAgeGroupValidationMessage(memberSelect.value);
    message.className = "form-message error";
    return false;
  }

  const ageGroup = getAutomaticAgeGroup(selectedMember);
  ageGroupInput.value = ageGroup || "";

  if (!ageGroup) {
    message.textContent = getAgeGroupValidationMessage(memberSelect.value);
    message.className = "form-message error";
    return false;
  }

  message.textContent = "";
  message.className = "form-message";
  return true;
}

function initialiseRegistrationPage() {
  const form = document.querySelector("#create-registration-form");
  if (!form) {
    return;
  }

  initialiseStorage();
  populateMemberOptions();
  renderRegistrationList();

  const message = document.querySelector("#create-registration-message");
  const memberSelect = document.querySelector("#registration-member");
  memberSelect.addEventListener("change", updateRegistrationAgeGroupField);
  form.addEventListener("reset", function () {
    window.setTimeout(updateRegistrationAgeGroupField, 0);
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    if (!updateRegistrationAgeGroupField()) {
      if (!memberSelect.value) {
        message.textContent = "Select a member before creating a registration.";
        message.className = "form-message error";
      }
      return;
    }

    const registrationId = createRegistration(
      form.elements.memberId.value,
      form.elements.season.value,
      form.elements.ageGroup.value
    );

    if (registrationId === null) {
      message.textContent = "A registration for this member and season already exists, or the registration details are invalid.";
      message.className = "form-message error";
      return;
    }

    form.reset();
    message.textContent = "Registration created successfully. Registration ID #" + registrationId + ".";
    message.className = "form-message success";
    renderRegistrationList(registrationId);
    showRegistrationDetails(registrationId);
  });
}

function initialiseRegistrationNavigation() {
  if (!document.querySelector("#create-registration-form")) {
    return;
  }

  document.querySelectorAll(".nav-group-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      const submenu = document.getElementById(toggle.getAttribute("aria-controls"));
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";

      toggle.setAttribute("aria-expanded", String(!isExpanded));
      if (submenu) {
        submenu.hidden = isExpanded;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initialiseRegistrationNavigation();
  initialiseRegistrationPage();
});
