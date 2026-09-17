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

function createRegistration(memberId, season, ageGroup) {
  const numericMemberId = Number(memberId);
  const cleanSeason = String(season || "").trim();
  const cleanAgeGroup = String(ageGroup || "").trim();
  const registrations = getStore("registrations");

  if (!memberExists(numericMemberId) || !cleanSeason || !cleanAgeGroup) {
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
    ageGroup: cleanAgeGroup,
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
  const hasAgeGroup = Object.prototype.hasOwnProperty.call(updatedFields, "ageGroup");

  if (!hasSeason && !hasAgeGroup) {
    return false;
  }

  const registration = registrations[registrationIndex];
  const season = hasSeason ? String(updatedFields.season || "").trim() : registration.season;
  const ageGroup = hasAgeGroup ? String(updatedFields.ageGroup || "").trim() : registration.ageGroup;

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
    '<div class="field"><label for="edit-season">Season</label><input id="edit-season" name="season" type="text" required></div>' +
    '<div class="field"><label for="edit-age-group">Age group</label><input id="edit-age-group" name="ageGroup" type="text" required></div>' +
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
      season: form.elements.season.value,
      ageGroup: form.elements.ageGroup.value
    })) {
      showRegistrationDetails(registration.registrationId, "Registration changes could not be saved. A registration for this member and season may already exist.", true);
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

function initialiseRegistrationPage() {
  const form = document.querySelector("#create-registration-form");
  if (!form) {
    return;
  }

  initialiseStorage();
  populateMemberOptions();
  renderRegistrationList();

  const message = document.querySelector("#create-registration-message");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
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
