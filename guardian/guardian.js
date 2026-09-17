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

function updateGuardian(guardianId, updatedData) {
  const guardians = getAllGuardians();

  const guardianIndex = guardians.findIndex(function (guardian) {
    return guardian.guardianId === Number(guardianId);
  });

  if (guardianIndex === -1) {
    throw new Error("Guardian not found.");
  }

  guardians[guardianIndex].mobile = String(updatedData.mobile || "").trim();

  if (!saveStore("guardians", guardians)) {
    throw new Error("Guardian information could not be updated.");
  }

  return guardians[guardianIndex];
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

function initialiseGuardianPage() {
  const form = document.querySelector("#add-guardian-form");

  if (!form) {
    return;
  }

  initialiseStorage();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    try {
      const guardian = addGuardian({
        firstName: document.querySelector("#first-name").value,
        lastName: document.querySelector("#last-name").value,
        mobile: document.querySelector("#mobile").value,
        email: document.querySelector("#email").value,
        address: document.querySelector("#address").value
      });

      form.reset();

      const message = document.querySelector("#form-message");
      message.textContent =
        "Guardian saved successfully. Guardian ID #" + guardian.guardianId + ".";
      message.className = "form-message success";

    } catch (error) {
      const message = document.querySelector("#form-message");
      message.textContent = error.message;
      message.className = "form-message error";
    }
  });
}

function initialiseGuardianLink() {
  const form = document.querySelector("#link-guardian-form");

  if (!form) {
    return;
  }

  initialiseStorage();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    try {
      const guardianId = document.querySelector("#guardian-id").value;
      const memberId = document.querySelector("#member-id").value;

      const linked = linkGuardianToMember(guardianId, memberId);

      const message = document.querySelector("#link-message");

      if (linked) {
        message.textContent =
          "Guardian linked to junior successfully.";
        message.className = "form-message success";
      } else {
        message.textContent =
          "This guardian is already linked to this junior.";
        message.className = "form-message";
      }

    } catch (error) {
      const message = document.querySelector("#link-message");
      message.textContent = error.message;
      message.className = "form-message error";
    }
  });
}

function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function renderGuardianList(guardianList) {
  const listBody = document.querySelector("#guardian-list");
  const totalGuardians = document.querySelector("#total-guardians");

  if (!listBody || !totalGuardians) {
    return;
  }

  listBody.replaceChildren();
  totalGuardians.textContent = getAllGuardians().length;

  if (guardianList.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 4;
    cell.className = "empty-state";
    cell.textContent = "No guardians found.";

    row.appendChild(cell);
    listBody.appendChild(row);
    return;
  }

  guardianList.forEach(function (guardian) {
    const row = document.createElement("tr");

    const nameCell = createCell(
      guardian.firstName + " " + guardian.lastName
    );

    nameCell.className = "guardian-name";

    row.appendChild(nameCell);
    row.appendChild(createCell(guardian.mobile));
    row.appendChild(createCell(guardian.email));
    row.appendChild(createCell(guardian.address));

    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute(
      "aria-label",
      "View " + guardian.firstName + " " + guardian.lastName
    );

    row.addEventListener("click", function () {
      showGuardianDetails(guardian);
    });

    row.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showGuardianDetails(guardian);
      }
    });

    listBody.appendChild(row);
  });
}

function initialiseGuardianSearchPage() {
  const searchInput = document.querySelector("#guardian-search");

  if (!searchInput) {
    return;
  }

  initialiseStorage();
  renderGuardianList(getAllGuardians());

  searchInput.addEventListener("input", function () {
    renderGuardianList(
      searchGuardiansByName(searchInput.value)
    );
  });
}

function showGuardianDetails(guardian) {
  const details = document.querySelector("#guardian-details");

  if (!details) {
    return;
  }

  details.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent =
    guardian.firstName + " " + guardian.lastName;

  const id = document.createElement("p");
  id.className = "detail-id";
  id.textContent = "Guardian ID #" + guardian.guardianId;

  const information = document.createElement("dl");

  const mobileLabel = document.createElement("dt");
  mobileLabel.textContent = "Mobile";

  const mobileValue = document.createElement("dd");
  mobileValue.textContent = guardian.mobile;

  const emailLabel = document.createElement("dt");
  emailLabel.textContent = "Email";

  const emailValue = document.createElement("dd");
  emailValue.textContent = guardian.email;

  const addressLabel = document.createElement("dt");
  addressLabel.textContent = "Address";

  const addressValue = document.createElement("dd");
  addressValue.textContent = guardian.address;

  information.appendChild(mobileLabel);
  information.appendChild(mobileValue);
  information.appendChild(emailLabel);
  information.appendChild(emailValue);
  information.appendChild(addressLabel);
  information.appendChild(addressValue);

  details.appendChild(heading);
  details.appendChild(id);
  details.appendChild(information);

  const linkedJuniorsHeading = document.createElement("h4");
  linkedJuniorsHeading.textContent = "Linked Juniors";

  const linkedJuniors = document.createElement("ul");

  const guardianLinks = getStore("guardianMembers").filter(function (link) {
    return link.guardianId === guardian.guardianId;
  });

  guardianLinks.forEach(function (link) {
    const member = getStore("members").find(function (item) {
      return item.memberId === link.memberId;
    });

    if (member) {
      const junior = document.createElement("li");
      junior.textContent =
        member.firstName + " " + member.lastName;

      linkedJuniors.appendChild(junior);
    }
  });

  if (linkedJuniors.children.length === 0) {
    const noJuniors = document.createElement("p");
    noJuniors.textContent = "No juniors linked.";
    details.appendChild(linkedJuniorsHeading);
    details.appendChild(noJuniors);
  } else {
    details.appendChild(linkedJuniorsHeading);
    details.appendChild(linkedJuniors);
  }

  const actions = document.createElement("div");
  actions.className = "detail-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "primary-button";
  editButton.textContent = "Edit Guardian";

  editButton.addEventListener("click", function () {
    showGuardianEditForm(guardian);
  });

  actions.appendChild(editButton);
  details.appendChild(actions);
}

function showGuardianEditForm(guardian) {
  const details = document.querySelector("#guardian-details");

  if (!details) {
    return;
  }

  details.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "Edit Guardian";

  const form = document.createElement("form");
  form.className = "edit-guardian-form";

  const fieldGrid = document.createElement("div");
  fieldGrid.className = "field-grid";

  const field = document.createElement("div");
  field.className = "field";

  const label = document.createElement("label");
  label.textContent = "Mobile";
  label.setAttribute("for", "edit-mobile");

  const input = document.createElement("input");
  input.id = "edit-mobile";
  input.type = "tel";
  input.value = guardian.mobile;
  input.required = true;

  field.appendChild(label);
  field.appendChild(input);
  fieldGrid.appendChild(field);

  const message = document.createElement("p");
  message.className = "form-message";

  const actions = document.createElement("div");
  actions.className = "detail-actions";

  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.className = "primary-button";
  saveButton.textContent = "Save Changes";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "secondary-button";
  cancelButton.textContent = "Cancel";

  cancelButton.addEventListener("click", function () {
    showGuardianDetails(getGuardianById(guardian.guardianId));
  });

  actions.appendChild(saveButton);
  actions.appendChild(cancelButton);

  form.appendChild(fieldGrid);
  form.appendChild(message);
  form.appendChild(actions);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    try {
      const updatedGuardian = updateGuardian(
        guardian.guardianId,
        {
          mobile: input.value
        }
      );

      showGuardianDetails(updatedGuardian);

    } catch (error) {
      message.textContent = error.message;
      message.className = "form-message error";
    }
  });

  details.appendChild(heading);
  details.appendChild(form);
}

function initialiseGuardianNavigation() {
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
  initialiseGuardianNavigation();
  initialiseGuardianPage();
  initialiseGuardianLink();
  initialiseGuardianSearchPage();
});
