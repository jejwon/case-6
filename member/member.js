/* Member business functions and the Add New Member page controller. */

function getAllMembers() {
  return getStore("members");
}

function getMemberById(memberId) {
  return getAllMembers().find(function (member) {
    return member.memberId === Number(memberId);
  }) || null;
}

function searchMembersByName(name) {
  const searchTerm = String(name || "").trim().toLowerCase();

  return getAllMembers().filter(function (member) {
    const fullName = (member.firstName + " " + member.lastName).toLowerCase();
    return fullName.includes(searchTerm);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidGender(gender) {
  return ["Male", "Female"].includes(String(gender || "").trim());
}

function normaliseDateOfBirth(dateValue) {
  const value = String(dateValue || "").trim();
  const match = /^(?:(\d{4})-(\d{2})-(\d{2})|(\d{2})\/(\d{2})\/(\d{4}))$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1] || match[6]);
  const month = Number(match[2] || match[5]);
  const day = Number(match[3] || match[4]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) {
    return null;
  }

  return String(year).padStart(4, "0") + "-" +
    String(month).padStart(2, "0") + "-" +
    String(day).padStart(2, "0");
}

function hasRequiredMemberDetails(memberData) {
  return ["firstName", "lastName", "dateOfBirth", "gender", "phone"].every(function (field) {
    return String(memberData[field] || "").trim() !== "";
  });
}

function addMember(memberData) {
  const existingMembers = getAllMembers();
  const email = String(memberData.email || "").trim();
  const dateOfBirth = normaliseDateOfBirth(memberData.dateOfBirth);

  if (!hasRequiredMemberDetails(memberData) || !isValidGender(memberData.gender)) {
    throw new Error("Complete all required member fields and select a valid gender.");
  }

  if (!dateOfBirth) {
    throw new Error("Enter a valid date of birth.");
  }

  if (email && !isValidEmail(email)) {
    throw new Error("Enter a valid email address or leave the email field blank.");
  }

  const nextId = Math.max.apply(null, existingMembers.map(function (member) {
    return member.memberId;
  }).concat([0])) + 1;

  const member = {
    memberId: nextId,
    firstName: String(memberData.firstName || "").trim(),
    lastName: String(memberData.lastName || "").trim(),
    dateOfBirth: dateOfBirth,
    gender: String(memberData.gender || "").trim(),
    phone: String(memberData.phone || "").trim(),
    email: email,
    status: "Active"
  };

  existingMembers.push(member);
  if (!saveStore("members", existingMembers)) {
    throw new Error("Member information could not be saved.");
  }

  return member.memberId;
}

function updateMember(memberId, updatedFields) {
  const allowedFields = ["firstName", "lastName", "dateOfBirth", "gender", "phone", "email", "status"];
  const members = getAllMembers();
  const memberIndex = members.findIndex(function (member) {
    return member.memberId === Number(memberId);
  });

  if (memberIndex === -1) {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(updatedFields, "dateOfBirth")) {
    const dateOfBirth = normaliseDateOfBirth(updatedFields.dateOfBirth);
    if (!dateOfBirth) {
      return false;
    }
    updatedFields = Object.assign({}, updatedFields, { dateOfBirth: dateOfBirth });
  }

  const requiredFields = ["firstName", "lastName", "dateOfBirth", "gender", "phone"];
  const hasInvalidRequiredField = requiredFields.some(function (field) {
    return Object.prototype.hasOwnProperty.call(updatedFields, field) &&
      String(updatedFields[field] || "").trim() === "";
  });

  if (hasInvalidRequiredField ||
      (Object.prototype.hasOwnProperty.call(updatedFields, "gender") && !isValidGender(updatedFields.gender))) {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(updatedFields, "email")) {
    const email = String(updatedFields.email || "").trim();
    if (email && !isValidEmail(email)) {
      return false;
    }
    updatedFields = Object.assign({}, updatedFields, { email: email });
  }

  allowedFields.forEach(function (field) {
    if (Object.prototype.hasOwnProperty.call(updatedFields, field)) {
      members[memberIndex][field] = updatedFields[field];
    }
  });

  return saveStore("members", members);
}

function deactivateMember(memberId) {
  return updateMember(memberId, { status: "Inactive" });
}

function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(dateValue + "T00:00:00"));
}

function renderMemberList(memberList) {
  const listBody = document.querySelector("#member-list");
  const totalMembers = document.querySelector("#total-members");

  if (!listBody || !totalMembers) {
    return;
  }

  listBody.replaceChildren();
  totalMembers.textContent = getAllMembers().length;

  if (memberList.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty-state";
    cell.textContent = "No members found.";
    row.appendChild(cell);
    listBody.appendChild(row);
    return;
  }

  memberList.forEach(function (member) {
    const row = document.createElement("tr");
    const nameCell = createCell(member.firstName + " " + member.lastName);
    nameCell.className = "member-name";
    row.appendChild(nameCell);
    row.appendChild(createCell(formatDate(member.dateOfBirth)));
    row.appendChild(createCell(member.phone));
    row.appendChild(createCell(member.email));

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = "status status-" + member.status.toLowerCase();
    status.textContent = member.status;
    statusCell.appendChild(status);
    row.appendChild(statusCell);
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", "View " + member.firstName + " " + member.lastName);
    row.addEventListener("click", function () {
      showMemberDetails(member);
    });
    row.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showMemberDetails(member);
      }
    });
    listBody.appendChild(row);
  });
}

function refreshMemberSearchResults() {
  const searchInput = document.querySelector("#member-search");
  if (searchInput) {
    renderMemberList(searchMembersByName(searchInput.value));
  }
}

function createRegistrationHistory(member) {
  const history = document.createElement("section");
  history.className = "registration-history";

  const heading = document.createElement("h4");
  heading.textContent = "Registration History";
  history.appendChild(heading);

  const registrations = getRegistrationsByMember(member.memberId).slice().sort(function (first, second) {
    return String(second.season).localeCompare(String(first.season), undefined, {
      numeric: true
    });
  });

  if (registrations.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "history-empty-state";
    emptyState.textContent = "No registration history found for this member.";
    history.appendChild(emptyState);
    return history;
  }

  const tableWrap = document.createElement("div");
  tableWrap.className = "history-table-wrap";
  const table = document.createElement("table");
  const tableHead = document.createElement("thead");
  const headingRow = document.createElement("tr");

  ["Season", "Age Group", "Status"].forEach(function (label) {
    const headingCell = document.createElement("th");
    headingCell.scope = "col";
    headingCell.textContent = label;
    headingRow.appendChild(headingCell);
  });

  tableHead.appendChild(headingRow);
  table.appendChild(tableHead);

  const tableBody = document.createElement("tbody");
  registrations.forEach(function (registration) {
    const row = document.createElement("tr");
    row.appendChild(createCell(registration.season));
    row.appendChild(createCell(registration.ageGroup));

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = "status registration-status-" + String(registration.status).toLowerCase();
    status.textContent = registration.status;
    statusCell.appendChild(status);
    row.appendChild(statusCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  tableWrap.appendChild(table);
  history.appendChild(tableWrap);
  return history;
}

function showMemberDetails(member, notice) {
  const details = document.querySelector("#member-details");
  if (!details) {
    return;
  }

  details.replaceChildren();

  const title = document.createElement("h3");
  title.textContent = member.firstName + " " + member.lastName;
  const id = document.createElement("p");
  id.className = "detail-id";
  id.textContent = "Member ID #" + member.memberId;
  const contact = document.createElement("dl");
  const detailsToShow = [
    ["Date of birth", formatDate(member.dateOfBirth)],
    ["Gender", member.gender],
    ["Phone", member.phone],
    ["Email", member.email],
    ["Status", member.status]
  ];

  const guardianLinks = getStore("guardianMembers").filter(function (link) {
    return link.memberId === member.memberId;
  });

  guardianLinks.forEach(function (link) {
    const guardian = getStore("guardians").find(function (item) {
      return item.guardianId === link.guardianId;
    });

    if (guardian) {
      detailsToShow.push([
        "Guardian",
        guardian.firstName + " " + guardian.lastName
      ]);

      detailsToShow.push([
        "Guardian Mobile",
        guardian.mobile
      ]);
    }
  });

  detailsToShow.forEach(function (item) {
    const term = document.createElement("dt");
    term.textContent = item[0];
    const definition = document.createElement("dd");
    definition.textContent = item[1];
    contact.append(term, definition);
  });

  const registrationHistory = createRegistrationHistory(member);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "primary-button";
  editButton.textContent = "Edit member";
  editButton.addEventListener("click", function () {
    showMemberEditForm(member);
  });
  actions.appendChild(editButton);

  if (member.status !== "Inactive") {
    const deactivateButton = document.createElement("button");
    deactivateButton.type = "button";
    deactivateButton.className = "danger-button";
    deactivateButton.textContent = "Deactivate member";
    deactivateButton.addEventListener("click", function () {
      if (deactivateMember(member.memberId)) {
        refreshMemberSearchResults();
        showMemberDetails(getMemberById(member.memberId), "Member marked as inactive.");
      }
    });
    actions.appendChild(deactivateButton);
  }

  details.append(title, id, contact, registrationHistory, actions);

  if (notice) {
    const message = document.createElement("p");
    message.className = "form-message success";
    message.textContent = notice;
    details.appendChild(message);
  }
}

function showMemberEditForm(member) {
  const details = document.querySelector("#member-details");
  if (!details) {
    return;
  }

  details.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "Edit member";
  const id = document.createElement("p");
  id.className = "detail-id";
  id.textContent = "Member ID #" + member.memberId;
  const form = document.createElement("form");
  form.className = "edit-member-form";
  form.innerHTML =
    '<div class="field-grid two-columns">' +
    '<div class="field"><label for="edit-first-name">First name <span aria-hidden="true">*</span></label><input id="edit-first-name" name="firstName" type="text" autocomplete="given-name" required></div>' +
    '<div class="field"><label for="edit-last-name">Last name <span aria-hidden="true">*</span></label><input id="edit-last-name" name="lastName" type="text" autocomplete="family-name" required></div>' +
    '</div>' +
    '<div class="field-grid two-columns">' +
    '<div class="field"><label for="edit-date-of-birth">Date of birth <span aria-hidden="true">*</span></label><input id="edit-date-of-birth" name="dateOfBirth" type="date" required></div>' +
    '<div class="field"><label for="edit-gender">Gender <span aria-hidden="true">*</span></label><select id="edit-gender" name="gender" required><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option></select></div>' +
    '</div>' +
    '<div class="field-grid two-columns">' +
    '<div class="field"><label for="edit-phone">Phone <span aria-hidden="true">*</span></label><input id="edit-phone" name="phone" type="tel" autocomplete="tel" required></div>' +
    '<div class="field"><label for="edit-email">Email</label><input id="edit-email" name="email" type="email" autocomplete="email"></div>' +
    '</div>' +
    '<p class="form-message" aria-live="polite"></p>' +
    '<div class="detail-actions"><button class="secondary-button" type="button">Cancel</button><button class="primary-button" type="submit">Save changes</button></div>';

  form.elements.firstName.value = member.firstName;
  form.elements.lastName.value = member.lastName;
  form.elements.dateOfBirth.value = member.dateOfBirth || "";
  form.elements.gender.value = member.gender || "";
  form.elements.phone.value = member.phone || "";
  form.elements.email.value = member.email || "";
  form.elements.dateOfBirth.max = new Date().toISOString().slice(0, 10);
  form.querySelector(".secondary-button").addEventListener("click", function () {
    showMemberDetails(getMemberById(member.memberId));
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    const updated = updateMember(member.memberId, {
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value,
      dateOfBirth: form.elements.dateOfBirth.value,
      gender: form.elements.gender.value,
      phone: form.elements.phone.value,
      email: form.elements.email.value
    });

    if (!updated) {
      const message = form.querySelector(".form-message");
      message.textContent = "Member changes could not be saved. Check required fields, date of birth and email.";
      message.className = "form-message error";
      return;
    }

    refreshMemberSearchResults();
    showMemberDetails(getMemberById(member.memberId), "Member changes saved.");
  });

  details.append(title, id, form);
}

function initialiseMemberPage() {
  const form = document.querySelector("#add-member-form");
  if (!form) {
    return;
  }

  initialiseStorage();

  const message = document.querySelector("#form-message");
  const dateOfBirth = document.querySelector("#date-of-birth");
  dateOfBirth.max = new Date().toISOString().slice(0, 10);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    try {
      const memberId = addMember({
        firstName: document.querySelector("#first-name").value,
        lastName: document.querySelector("#last-name").value,
        dateOfBirth: dateOfBirth.value,
        gender: document.querySelector("#gender").value,
        phone: document.querySelector("#phone").value,
        email: document.querySelector("#email").value
      });
      form.reset();
      dateOfBirth.max = new Date().toISOString().slice(0, 10);
      message.textContent = "Member saved successfully. Member ID #" + memberId + ".";
      message.className = "form-message success";
    } catch (error) {
      message.textContent = error.message;
      message.className = "form-message error";
    }
  });

}

function initialiseMemberSearchPage() {
  const searchInput = document.querySelector("#member-search");
  if (!searchInput) {
    return;
  }

  initialiseStorage();
  renderMemberList(getAllMembers());

  searchInput.addEventListener("input", function () {
    renderMemberList(searchMembersByName(searchInput.value));
  });
}

function initialiseMemberNavigation() {
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
  initialiseMemberNavigation();
  initialiseMemberPage();
  initialiseMemberSearchPage();
});
