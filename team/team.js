// team.js
/* Team Management
 * Uses shared storage from mockdata.js and seed data from ../data.js.
 */
/* =========================================================
   TEAM MANAGEMENT
   =========================================================
   Data source:
   - mockdata.js
   - ../data.js

   Main functions:
   - Create team
   - View teams
   - Filter teams by season
   - Rename team
   - Remove team
   - View roster
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  initialiseStorage();

  const createForm = document.getElementById("create-team-form");
  const teamList = document.getElementById("team-list");
  const seasonFilter = document.getElementById("season-filter");
  const ageGroupFilter = document.getElementById("age-group-filter");function populateAgeGroupFilter() {

  const teams = getTeams();

  const currentValue =
    ageGroupFilter.value;

  const ageGroups = [
    ...new Set(
      teams
        .map(function (team) {
          return String(team.ageGroup);
        })
        .filter(function (ageGroup) {
          return ageGroup.trim() !== "";
        })
    )
  ].sort(function (a, b) {

    return a.localeCompare(
      b,
      undefined,
      {
        numeric: true,
        sensitivity: "base"
      }
    );

  });


  ageGroupFilter.innerHTML =
    '<option value="all">All age groups</option>';


  ageGroups.forEach(function (ageGroup) {

    const option =
      document.createElement("option");

    option.value = ageGroup;
    option.textContent = ageGroup;

    ageGroupFilter.appendChild(option);
  });


  if (
    ageGroups.includes(currentValue)
  ) {

    ageGroupFilter.value =
      currentValue;

  } else {

    ageGroupFilter.value =
      "all";
  }
}
  const message = document.getElementById("team-form-message");

  /* =========================================================
     DATA ACCESS
     ========================================================= */

  function getTeams() {
    return getStore("teams");
  }

  function getTeamMembers() {
    return getStore("teamMembers");
  }


  /* =========================================================
     UTILITY FUNCTIONS
     ========================================================= */

  function generateId(prefix, items) {

    let number = items.length + 1;

    let id =
      prefix +
      String(number).padStart(3, "0");

    while (
      items.some(function (item) {
        return item.id === id;
      })
    ) {
      number++;

      id =
        prefix +
        String(number).padStart(3, "0");
    }

    return id;
  }


  function escapeHtml(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function showMessage(text, type) {

    message.textContent = text;

    message.className =
      "form-message " +
      (type || "");
  }


  function getRosterCount(teamId) {

    return getTeamMembers().filter(function (item) {

      return item.teamId === teamId;

    }).length;
  }


  /* =========================================================
     SEASON FILTER
     ========================================================= */

  function populateSeasonFilter() {

    const teams = getTeams();

    const currentValue =
      seasonFilter.value;

    const seasons = [
      ...new Set(
        teams.map(function (team) {
          return String(team.season);
        })
      )
    ].sort(function (a, b) {
      return Number(b) - Number(a);
    });


    seasonFilter.innerHTML =
      '<option value="all">All seasons</option>';


    seasons.forEach(function (season) {

      const option =
        document.createElement("option");

      option.value = season;
      option.textContent = season;

      seasonFilter.appendChild(option);
    });


    if (seasons.includes(currentValue)) {

      seasonFilter.value =
        currentValue;
    }
  }

  function populateAgeGroupFilter() {

  const teams = getTeams();

  const currentValue =
    ageGroupFilter.value;

  const ageGroups = [
    ...new Set(
      teams
        .map(function (team) {
          return String(team.ageGroup);
        })
        .filter(function (ageGroup) {
          return ageGroup.trim() !== "";
        })
    )
  ].sort(function (a, b) {

    return a.localeCompare(
      b,
      undefined,
      {
        numeric: true,
        sensitivity: "base"
      }
    );

  });


  ageGroupFilter.innerHTML =
    '<option value="all">All age groups</option>';


  ageGroups.forEach(function (ageGroup) {

    const option =
      document.createElement("option");

    option.value = ageGroup;
    option.textContent = ageGroup;

    ageGroupFilter.appendChild(option);
  });


  if (
    ageGroups.includes(currentValue)
  ) {

    ageGroupFilter.value =
      currentValue;

  } else {

    ageGroupFilter.value =
      "all";
  }
}

  /* =========================================================
     RENDER TEAM LIST
     ========================================================= */

  function renderTeams() {

    const teams = getTeams();

    const selectedSeason =
      seasonFilter.value;

    const selectedAgeGroup =
      ageGroupFilter.value;


    const filteredTeams =
      teams.filter(function (team) {

        const seasonMatches =
          selectedSeason === "all" ||
          String(team.season) ===
            String(selectedSeason);


        const ageGroupMatches =
          selectedAgeGroup === "all" ||
          String(team.ageGroup).toLowerCase() ===
            String(selectedAgeGroup).toLowerCase();


        return (
          seasonMatches &&
          ageGroupMatches
        );

      });


    teamList.innerHTML = "";


    if (filteredTeams.length === 0) {

      teamList.innerHTML =
        '<p class="empty-state">' +
        'No teams found for the selected season.' +
        '</p>';

      return;
    }


    filteredTeams.forEach(function (team) {

      const card =
        document.createElement("article");

      card.className =
        "list-item";


      const rosterCount =
        getRosterCount(team.id);


      card.innerHTML = `

        <div>

          <p class="eyebrow">
            ${escapeHtml(team.ageGroup)}
            ·
            ${escapeHtml(team.gender)}
          </p>

          <h3>
            ${escapeHtml(team.name)}
          </h3>

          <p>
            Season:
            ${escapeHtml(String(team.season))}
          </p>

          <p>
            Players:
            ${rosterCount}
          </p>

        </div>


        <div class="form-actions team-actions">
          <a
            class="view-roster"
            href="../roster/roster.html?teamId=${encodeURIComponent(team.id)}"
          >
            View roster
          </a>
          <button
            class="secondary-button rename-team"
            type="button"
            data-id="${escapeHtml(team.id)}"
          >
            Rename
          </button>
          <button
            class="secondary-button delete-team"
            type="button"
            data-id="${escapeHtml(team.id)}"
          >
            Remove team
          </button>
        </div>

      `;


      teamList.appendChild(card);
    });
  }


  /* =========================================================
     CREATE TEAM
     ========================================================= */

  createForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const formData =
        new FormData(createForm);


      const name =
        String(
          formData.get("name") || ""
        ).trim();


      const season =
        Number(
          formData.get("season")
        );


      const ageGroup =
        String(
          formData.get("ageGroup") || ""
        ).trim();


      const gender =
        String(
          formData.get("gender") || ""
        ).trim();


      /* Required fields */

      if (
        !name ||
        !season ||
        !ageGroup ||
        !gender
      ) {

        showMessage(
          "Please complete all required fields.",
          "error"
        );

        return;
      }


      const teams =
        getTeams();


      /* Prevent duplicate team names
         within the same season */

      const duplicate =
        teams.some(function (team) {

          return (
            String(team.name)
              .toLowerCase() ===
              name.toLowerCase() &&

            String(team.season) ===
              String(season)
          );

        });


      if (duplicate) {

        showMessage(
          "A team with this name already exists for this season.",
          "error"
        );

        return;
      }


      /* Create new team */

      const newTeam = {

        id:
          generateId(
            "T",
            teams
          ),

        season:
          season,

        name:
          name,

        ageGroup:
          ageGroup,

        gender:
          gender
      };


      teams.push(newTeam);


      if (
        !saveStore(
          "teams",
          teams
        )
      ) {

        showMessage(
          "The team could not be saved.",
          "error"
        );

        return;
      }


      /* Reset form */

      createForm.reset();

      document.getElementById(
        "team-season"
      ).value = "2026";


      showMessage(
        "Team created successfully.",
        "success"
      );


      populateSeasonFilter();
      populateAgeGroupFilter();
      renderTeams();
    }
  );


  /* =========================================================
     TEAM BUTTON EVENTS
     ========================================================= */

  teamList.addEventListener(
    "click",
    function (event) {

      const renameButton =
        event.target.closest(
          ".rename-team"
        );


      const deleteButton =
        event.target.closest(
          ".delete-team"
        );


      if (renameButton) {

        renameTeam(
          renameButton.dataset.id
        );
      }


      if (deleteButton) {

        removeTeam(
          deleteButton.dataset.id
        );
      }
    }
  );


  /* =========================================================
     RENAME TEAM
     ========================================================= */

  function renameTeam(teamId) {

    const teams =
      getTeams();


    const team =
      teams.find(function (item) {

        return item.id === teamId;

      });


    if (!team) {
      return;
    }


    const newName =
      window.prompt(
        "Enter the new team name:",
        team.name
      );


    if (newName === null) {
      return;
    }


    const trimmedName =
      newName.trim();


    if (!trimmedName) {

      window.alert(
        "Team name cannot be empty."
      );

      return;
    }


    /* Check duplicate */

    const duplicate =
      teams.some(function (item) {

        return (
          item.id !== teamId &&

          String(item.season) ===
            String(team.season) &&

          String(item.name)
            .toLowerCase() ===
            trimmedName.toLowerCase()
        );

      });


    if (duplicate) {

      window.alert(
        "A team with this name already exists for this season."
      );

      return;
    }


    team.name =
      trimmedName;


    saveStore(
      "teams",
      teams
    );


    renderTeams();
  }


  /* =========================================================
     REMOVE TEAM
     ========================================================= */

  function removeTeam(teamId) {

    const teams =
      getTeams();


    const team =
      teams.find(function (item) {

        return item.id === teamId;

      });


    if (!team) {
      return;
    }


    const confirmed =
      window.confirm(
        'Remove "' +
        team.name +
        '"? Players will not be deleted from the member register.'
      );


    if (!confirmed) {
      return;
    }


    /* Remove team */

    const updatedTeams =
      teams.filter(function (item) {

        return item.id !== teamId;

      });


    /*
      Remove only TeamMember records
      connected to this team.

      Member records remain.
      Registration records remain.
    */

    const updatedTeamMembers =
      getTeamMembers().filter(
        function (item) {

          return item.teamId !== teamId;

        }
      );


    saveStore(
      "teams",
      updatedTeams
    );


    saveStore(
      "teamMembers",
      updatedTeamMembers
    );


    populateSeasonFilter();

    renderTeams();
  }


  /* =========================================================
     SEASON FILTER EVENT
     ========================================================= */

  seasonFilter.addEventListener(
    "change",
    function () {

      renderTeams();

    }
  );
  ageGroupFilter.addEventListener(
    "change",
    function () {
      renderTeams();
    }
  );

  /* =========================================================
     INITIAL PAGE LOAD
     ========================================================= */

  populateSeasonFilter();
  populateAgeGroupFilter();
  renderTeams();

});