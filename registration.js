/* Season registration business functions. Load team/mockdata.js and data.js first. */

function getRegistrationsByMember(memberId) {
  return getStore("registrations").filter(function (registration) {
    return registration.memberId === Number(memberId);
  });
}

function getRegistrationById(registrationId) {
  return getStore("registrations").find(function (registration) {
    return registration.registrationId === Number(registrationId);
  }) || null;
}

function memberExists(memberId) {
  return getStore("members").some(function (member) {
    return member.memberId === Number(memberId);
  });
}

function getRegistrationMember(memberId) {
  return getStore("members").find(function (member) {
    return member.memberId === Number(memberId);
  }) || null;
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

  if (calculateCurrentAge(member.dateOfBirth) === null) {
    return "The selected member needs a valid date of birth before registration can be created.";
  }

  if (getAutomaticAgeGroup(member) === null) {
    return "The selected member needs Gender set to Male or Female before registration can be created.";
  }

  return "Registration details are invalid.";
}

function createRegistration(memberId, season, ageGroup) {
  const numericMemberId = Number(memberId);
  const cleanSeason = String(season || "").trim();
  const registrations = getStore("registrations");
  const generatedAgeGroup = getAutomaticAgeGroup(getRegistrationMember(numericMemberId));

  if (!memberExists(numericMemberId) || !cleanSeason || !generatedAgeGroup) {
    return null;
  }

  const alreadyRegistered = registrations.some(function (registration) {
    return registration.memberId === numericMemberId && registration.season === cleanSeason;
  });

  if (alreadyRegistered) {
    return null;
  }

  const nextId = Math.max.apply(null, registrations.map(function (registration) {
    return registration.registrationId;
  }).concat([0])) + 1;

  registrations.push({
    registrationId: nextId,
    memberId: numericMemberId,
    season: cleanSeason,
    ageGroup: generatedAgeGroup,
    status: "Started"
  });

  return saveStore("registrations", registrations) ? nextId : null;
}

function updateRegistration(registrationId, updatedFields) {
  const registrations = getStore("registrations");
  const registrationIndex = registrations.findIndex(function (registration) {
    return registration.registrationId === Number(registrationId);
  });

  if (registrationIndex === -1) {
    return false;
  }

  const hasSeason = Object.prototype.hasOwnProperty.call(updatedFields, "season");
  if (!hasSeason) {
    return false;
  }

  const registration = registrations[registrationIndex];
  const season = hasSeason ? String(updatedFields.season || "").trim() : registration.season;
  const ageGroup = getAutomaticAgeGroup(getRegistrationMember(registration.memberId));

  if (!season || !ageGroup) {
    return false;
  }

  const wouldDuplicateSeason = registrations.some(function (item) {
    return item.registrationId !== registration.registrationId &&
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
  const registration = registrations.find(function (item) {
    return item.registrationId === Number(registrationId);
  });

  if (!registration) {
    return false;
  }

  registration.status = "Withdrawn";
  return saveStore("registrations", registrations);
}

function getRegistrationStatus(memberId, season) {
  const registration = getStore("registrations").find(function (item) {
    return item.memberId === Number(memberId) && item.season === String(season);
  });

  return registration ? registration.status : null;
}

function getMemberName(memberId) {
  const member = getStore("members").find(function (item) {
    return item.memberId === Number(memberId);
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

    if (registration.registrationId === Number(selectedRegistrationId)) {
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
      showRegistrationDetails(registration.registrationId);
      renderRegistrationList(registration.registrationId);
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

  const title = document.createElement("h3");
  title.textContent = getMemberName(registration.memberId);
  const id = document.createElement("p");
  id.className = "detail-id";
  id.textContent = "Registration ID #" + registration.registrationId;

  const member = document.createElement("p");
  member.className = "detail-member";
  member.textContent = "Member ID #" + registration.memberId;

  const form = document.createElement("form");
  form.className = "edit-registration-form";
  form.innerHTML =
    '<div class="field"><label for="edit-season">Season <span aria-hidden="true">*</span></label><input id="edit-season" name="season" type="text" required></div>' +
    '<div class="field"><label for="edit-age-group">Age group</label><input id="edit-age-group" name="ageGroup" type="text" readonly aria-readonly="true"></div>' +
    '<div class="registration-status"><span>Status</span><strong class="' + registrationStatusClass(registration.status) + '">' + registration.status + '</strong></div>' +
    '<p class="form-message" aria-live="polite"></p>' +
    '<div class="detail-actions"><button class="primary-button" type="submit">Update Registration</button></div>';

  form.elements.season.value = registration.season;
  form.elements.ageGroup.value = registration.ageGroup;
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    if (!updateRegistration(registration.registrationId, {
      season: form.elements.season.value
    })) {
      const generatedAgeGroup = getAutomaticAgeGroup(getRegistrationMember(registration.memberId));
      const errorMessage = generatedAgeGroup ?
        "Registration changes could not be saved. A registration for this member and season may already exist." :
        getAgeGroupValidationMessage(registration.memberId);
      showRegistrationDetails(registration.registrationId, errorMessage, true);
      return;
    }

    showRegistrationDetails(registration.registrationId, "Registration changes saved.");
    renderRegistrationList(registration.registrationId);
  });

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  if (registration.status !== "Withdrawn") {
    const withdrawButton = document.createElement("button");
    withdrawButton.type = "button";
    withdrawButton.className = "danger-button";
    withdrawButton.textContent = "Withdraw Registration";
    withdrawButton.addEventListener("click", function () {
      if (withdrawRegistration(registration.registrationId)) {
        showRegistrationDetails(registration.registrationId, "Registration withdrawn.");
        renderRegistrationList(registration.registrationId);
      }
    });
    actions.appendChild(withdrawButton);
  }

  details.append(title, id, member, form, actions);

  if (notice) {
    const message = document.createElement("p");
    message.className = "form-message " + (isError ? "error" : "success");
    message.textContent = notice;
    details.appendChild(message);
  }
}

function populateMemberOptions() {
  const select = document.querySelector("#registration-member");
  if (!select) {
    return;
  }

  getStore("members").forEach(function (member) {
    const option = document.createElement("option");
    option.value = member.memberId;
    option.textContent = member.firstName + " " + member.lastName + " (Member ID #" + member.memberId + ")";
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

  const ageGroup = getAutomaticAgeGroup(getRegistrationMember(memberSelect.value));
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
