// roster.js
/* =========================================================
   TEAM ROSTER MANAGEMENT
   =========================================================
   Data source:
   - mockdata.js
   - ../data.js

   Main functions:
   - View team roster
   - Add registered player
   - Move player
   - Remove player
   - Search eligible players
   - View player contact details
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  initialiseStorage();


  /* =========================================================
     DOM ELEMENTS
     ========================================================= */

  const teamSelect =
    document.getElementById(
      "team-select"
    );


  const playerSelect =
    document.getElementById(
      "player-select"
    );


  const playerFilter =
    document.getElementById(
      "player-filter"
    );


  const addPlayerForm =
    document.getElementById(
      "add-player-form"
    );


  const rosterContent =
    document.getElementById(
      "roster-content"
    );


  const rosterMessage =
    document.getElementById(
      "roster-message"
    );


  const teamSummary =
    document.getElementById(
      "team-summary"
    );


  /* =========================================================
     SELECTED TEAM
     ========================================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );


  let selectedTeamId =
    params.get("teamId") || "";


  /* =========================================================
     DATA ACCESS
     ========================================================= */

  function getMembers() {

    return getStore(
      "members"
    );
  }


  function getRegistrations() {

    return getStore(
      "registrations"
    );
  }


  function getTeams() {

    return getStore(
      "teams"
    );
  }


  function getTeamMembers() {

    return getStore(
      "teamMembers"
    );
  }


  /* =========================================================
     UTILITY
     ========================================================= */

  function escapeHtml(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function showMessage(
    text,
    type
  ) {

    rosterMessage.textContent =
      text;


    rosterMessage.className =
      "form-message " +
      (type || "");
  }


  /* =========================================================
     FIND SELECTED TEAM
     ========================================================= */

  function getSelectedTeam() {

    return getTeams().find(
      function (team) {

        return (
          team.id ===
          selectedTeamId
        );

      }
    ) || null;
  }


  /* =========================================================
     FIND MEMBER
     ========================================================= */

  function getMember(memberId) {

    return getMembers().find(
      function (member) {

        return (
          member.id ===
          memberId
        );

      }
    ) || null;
  }


  /* =========================================================
     FIND VALID REGISTRATION
     =========================================================

     Player can only be added if:

     1. Registration belongs to player
     2. Same season
     3. Same age group
     4. Status = Complete
  */

  function getCompleteRegistrationForTeam(
    memberId,
    team
  ) {

    return getRegistrations().find(
      function (registration) {

        return (

          registration.memberId ===
            memberId &&

          String(
            registration.season
          ) ===
            String(
              team.season
            ) &&

          String(
            registration.ageGroup
          ).toLowerCase() ===
            String(
              team.ageGroup
            ).toLowerCase() &&

          registration.status ===
            "Complete"

        );

      }
    ) || null;
  }


  /* =========================================================
     POPULATE TEAM SELECT
     ========================================================= */

  function populateTeams() {

    const teams =
      getTeams();


    teamSelect.innerHTML =
      '<option value="">Select a team</option>';


    teams.forEach(
      function (team) {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          team.id;


        option.textContent =
          team.name +
          " (" +
          team.season +
          " - " +
          team.ageGroup +
          ")";


        teamSelect.appendChild(
          option
        );
      }
    );


    const teamExists =
      teams.some(
        function (team) {

          return (
            team.id ===
            selectedTeamId
          );

        }
      );


    if (
      selectedTeamId &&
      teamExists
    ) {

      teamSelect.value =
        selectedTeamId;

    } else {

      selectedTeamId =
        "";

      teamSelect.value =
        "";
    }
  }


  /* =========================================================
     GET ROSTER
     ========================================================= */

  function getRosterRecords(
    teamId
  ) {

    return getTeamMembers()
      .filter(
        function (teamMember) {

          return (
            teamMember.teamId ===
            teamId
          );

        }
      );
  }


  /* =========================================================
     RENDER ROSTER
     ========================================================= */

  function renderRoster() {

    const team =
      getSelectedTeam();


    /* No team selected */

    if (!team) {

      teamSummary.textContent =
        "";


      rosterContent.innerHTML =
        '<p class="empty-state">' +
        'Select a team to view its roster.' +
        '</p>';


      updatePlayerOptions();

      return;
    }


    /* Team information */

    teamSummary.textContent =
      team.name +
      " · " +
      team.ageGroup +
      " · " +
      team.gender +
      " · Season " +
      team.season;


    const roster =
      getRosterRecords(
        team.id
      );


    /* Empty roster */

    if (
      roster.length === 0
    ) {

      rosterContent.innerHTML =
        '<p class="empty-state">' +
        'This team currently has no players.' +
        '</p>';


      updatePlayerOptions();

      return;
    }


    /* Build roster */

    const rows =
      roster.map(
        function (record) {

          const member =
            getMember(
              record.memberId
            );


          const registration =
            getRegistrations()
              .find(
                function (item) {

                  return (
                    item.id ===
                    record.registrationId
                  );

                }
              );


          if (!member) {
            return "";
          }


          return `

            <div class="list-item">

              <div>

                <p class="eyebrow">
                  ${escapeHtml(
                    member.category
                  )}
                  ·
                  ${escapeHtml(
                    member.ageGroup
                  )}
                </p>


                <h3>
                  ${escapeHtml(
                    member.firstName +
                    " " +
                    member.lastName
                  )}
                </h3>


                <p>
                  Phone:
                  ${escapeHtml(
                    member.phone
                  )}
                </p>


                <p>
                  Email:
                  ${escapeHtml(
                    member.email ||
                    "No email recorded"
                  )}
                </p>


                <p>
                  Registration:
                  ${escapeHtml(
                    registration
                      ? registration.status
                      : "Unknown"
                  )}
                </p>

              </div>


              <div class="form-actions">

                <button
                  class="secondary-button move-player"
                  type="button"
                  data-member-id="${escapeHtml(
                    member.id
                  )}"
                >
                  Move
                </button>


                <button
                  class="secondary-button remove-player"
                  type="button"
                  data-member-id="${escapeHtml(
                    member.id
                  )}"
                >
                  Remove
                </button>

              </div>

            </div>

          `;
        }
      ).join("");


    rosterContent.innerHTML =
      rows;


    updatePlayerOptions();
  }


  /* =========================================================
     UPDATE PLAYER DROPDOWN
     ========================================================= */

  function updatePlayerOptions() {

    const team =
      getSelectedTeam();


    const searchTerm =
      playerFilter.value
        .trim()
        .toLowerCase();


    playerSelect.innerHTML =
      '<option value="">' +
      'Select a registered player' +
      '</option>';


    if (!team) {
      return;
    }


    const teamMembers =
      getTeamMembers();


    /*
      Only show players who:

      - have Complete registration
      - match the team's season
      - match the team's age group
      - are not already in this team
    */

    const eligiblePlayers =
      getMembers().filter(
        function (member) {

          const registration =
            getCompleteRegistrationForTeam(
              member.id,
              team
            );


          const alreadyInSelectedTeam =
            teamMembers.some(
              function (record) {

                return (

                  record.teamId ===
                    team.id &&

                  record.memberId ===
                    member.id

                );

              }
            );


          const name =
            (
              member.firstName +
              " " +
              member.lastName
            ).toLowerCase();


          return (

            registration &&

            !alreadyInSelectedTeam &&

            (
              !searchTerm ||
              name.includes(
                searchTerm
              )
            )

          );
        }
      );


    /* No eligible players */

    if (
      eligiblePlayers.length === 0
    ) {

      const option =
        document.createElement(
          "option"
        );


      option.disabled =
        true;


      option.textContent =
        "No eligible registered players found";


      playerSelect.appendChild(
        option
      );


      return;
    }


    /* Add eligible players */

    eligiblePlayers.forEach(
      function (member) {

        const registration =
          getCompleteRegistrationForTeam(
            member.id,
            team
          );


        const option =
          document.createElement(
            "option"
          );


        option.value =
          member.id;


        option.textContent =
          member.firstName +
          " " +
          member.lastName +
          " (" +
          member.ageGroup +
          ")";


        option.dataset.registrationId =
          registration.id;


        playerSelect.appendChild(
          option
        );
      }
    );
  }


  /* =========================================================
     GENERATE TEAM MEMBER ID
     ========================================================= */

  function generateId(
    prefix,
    items
  ) {

    let number =
      items.length + 1;


    let id =
      prefix +
      String(number)
        .padStart(3, "0");


    while (
      items.some(
        function (item) {

          return (
            item.id === id
          );

        }
      )
    ) {

      number++;


      id =
        prefix +
        String(number)
          .padStart(3, "0");
    }


    return id;
  }


  /* =========================================================
     ADD PLAYER
     ========================================================= */

  addPlayerForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const team =
        getSelectedTeam();


      const memberId =
        playerSelect.value;


      /* Team required */

      if (!team) {

        showMessage(
          "Please select a team first.",
          "error"
        );

        return;
      }


      /* Player required */

      if (!memberId) {

        showMessage(
          "Please select a registered player.",
          "error"
        );

        return;
      }


      /* Check registration */

      const registration =
        getCompleteRegistrationForTeam(
          memberId,
          team
        );


      if (!registration) {

        showMessage(
          "This player does not have a completed registration for this team and season.",
          "error"
        );

        return;
      }


      const teamMembers =
        getTeamMembers();


      /*
        Check whether player is
        already assigned to another team.
      */

      const alreadyInAnyTeam =
        teamMembers.find(
          function (record) {

            return (

              record.memberId ===
                memberId &&

              record.teamId !==
                team.id

            );

          }
        );


      if (alreadyInAnyTeam) {

        showMessage(
          "This player is already assigned to another team. Use Move instead.",
          "error"
        );

        return;
      }


      /* Check duplicate */

      const alreadyInThisTeam =
        teamMembers.some(
          function (record) {

            return (

              record.teamId ===
                team.id &&

              record.memberId ===
                memberId

            );

          }
        );


      if (alreadyInThisTeam) {

        showMessage(
          "This player is already in this team.",
          "error"
        );

        return;
      }


      /* Create TeamMember */

      const newTeamMember = {

        id:
          generateId(
            "TM",
            teamMembers
          ),

        teamId:
          team.id,

        memberId:
          memberId,

        registrationId:
          registration.id
      };


      teamMembers.push(
        newTeamMember
      );


      const saved =
        saveStore(
          "teamMembers",
          teamMembers
        );


      if (!saved) {

        showMessage(
          "The player could not be added.",
          "error"
        );

        return;
      }


      showMessage(
        "Player added to the team.",
        "success"
      );


      addPlayerForm.reset();


      renderRoster();
    }
  );


  /* =========================================================
     ROSTER BUTTON EVENTS
     ========================================================= */

  rosterContent.addEventListener(
    "click",
    function (event) {

      const moveButton =
        event.target.closest(
          ".move-player"
        );


      const removeButton =
        event.target.closest(
          ".remove-player"
        );


      if (moveButton) {

        movePlayer(
          moveButton.dataset.memberId
        );
      }


      if (removeButton) {

        removePlayer(
          removeButton.dataset.memberId
        );
      }
    }
  );


  /* =========================================================
     REMOVE PLAYER
     ========================================================= */

  function removePlayer(
    memberId
  ) {

    const team =
      getSelectedTeam();


    if (!team) {
      return;
    }


    const member =
      getMember(
        memberId
      );


    const playerName =
      member
        ? member.firstName +
          " " +
          member.lastName
        : "this player";


    const confirmed =
      window.confirm(
        "Remove " +
        playerName +
        " from " +
        team.name +
        "?"
      );


    if (!confirmed) {
      return;
    }


    /*
      Only delete the TeamMember
      relationship.

      Member remains.
      Registration remains.
    */

    const updatedTeamMembers =
      getTeamMembers().filter(
        function (record) {

          return !(
            record.teamId ===
              team.id &&

            record.memberId ===
              memberId
          );

        }
      );


    saveStore(
      "teamMembers",
      updatedTeamMembers
    );


    showMessage(
      "Player removed from the team.",
      "success"
    );


    renderRoster();
  }


  /* =========================================================
     MOVE PLAYER
     ========================================================= */

  function movePlayer(
    memberId
  ) {

    const currentTeam =
      getSelectedTeam();


    if (!currentTeam) {
      return;
    }


    const member =
      getMember(
        memberId
      );


    const teams =
      getTeams();


    /*
      Find teams that:

      - are not the current team
      - have the same season
      - have a valid Complete registration
    */

    const eligibleTeams =
      teams.filter(
        function (team) {

          if (
            team.id ===
            currentTeam.id
          ) {
            return false;
          }


          if (
            String(team.season) !==
            String(
              currentTeam.season
            )
          ) {
            return false;
          }


          return !!getCompleteRegistrationForTeam(
            memberId,
            team
          );
        }
      );


    if (
      eligibleTeams.length === 0
    ) {

      window.alert(
        "No other eligible team is available for this player in the same season."
      );

      return;
    }


    /* Create team choices */

    const choices =
      eligibleTeams
        .map(
          function (
            team,
            index
          ) {

            return (
              (index + 1) +
              ". " +
              team.name
            );

          }
        )
        .join("\n");


    const playerName =
      member
        ? member.firstName +
          " " +
          member.lastName
        : "player";


    const answer =
      window.prompt(
        "Move " +
        playerName +
        " to:\n\n" +
        choices +
        "\n\nEnter the number of the team:"
      );


    if (answer === null) {
      return;
    }


    const choiceIndex =
      Number(answer) - 1;


    if (
      !Number.isInteger(
        choiceIndex
      ) ||
      choiceIndex < 0 ||
      choiceIndex >=
        eligibleTeams.length
    ) {

      window.alert(
        "Invalid team selection."
      );

      return;
    }


    const destinationTeam =
      eligibleTeams[
        choiceIndex
      ];


    const teamMembers =
      getTeamMembers();


    const currentRecord =
      teamMembers.find(
        function (record) {

          return (

            record.teamId ===
              currentTeam.id &&

            record.memberId ===
              memberId

          );

        }
      );


    if (!currentRecord) {
      return;
    }


    /*
      Change the team relationship.
    */

    currentRecord.teamId =
      destinationTeam.id;


    /*
      Update registrationId
      to the valid registration
      for the destination team.
    */

    const destinationRegistration =
      getCompleteRegistrationForTeam(
        memberId,
        destinationTeam
      );


    if (
      destinationRegistration
    ) {

      currentRecord.registrationId =
        destinationRegistration.id;
    }


    saveStore(
      "teamMembers",
      teamMembers
    );


    showMessage(
      "Player moved to " +
      destinationTeam.name +
      ".",
      "success"
    );


    renderRoster();
  }


  /* =========================================================
     TEAM SELECT CHANGE
     ========================================================= */

  teamSelect.addEventListener(
    "change",
    function () {

      selectedTeamId =
        teamSelect.value;


      const url =
        new URL(
          window.location.href
        );


      if (selectedTeamId) {

        url.searchParams.set(
          "teamId",
          selectedTeamId
        );

      } else {

        url.searchParams.delete(
          "teamId"
        );
      }


      window.history.replaceState(
        {},
        "",
        url
      );


      showMessage(
        "",
        ""
      );


      renderRoster();
    }
  );


  /* =========================================================
     PLAYER SEARCH
     ========================================================= */

  playerFilter.addEventListener(
    "input",
    function () {

      updatePlayerOptions();

    }
  );


  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  populateTeams();

  renderRoster();

});