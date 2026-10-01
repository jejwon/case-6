# Warrigal Park Football Club Member Management System

## Project Overview

The Warrigal Park Football Club (WPFC) Member Management System is a browser-based web application prototype developed to support the management of club members, guardians, registrations, teams and team rosters.

The system was developed based on the requirements identified in the Warrigal Park Football Club case study.

The application uses synthetic mock data and browser `localStorage` for data storage. It is provided as a project prototype for demonstration and assessment purposes.

---

## Features

### Member Management

- Add member information
- Search for members
- View and update member information
- Make members inactive

### Guardian Management

- Add guardian information
- Search and update guardian information
- Link guardians to junior members
- Support one guardian being linked to multiple junior members

### Registration Management

- Create member registrations
- View and update registration information
- Complete or withdraw registrations
- Manage registrations by season and age group
- Apply the guardian requirement for junior members

### Team Management

- Create teams
- Specify season, age group and gender
- View teams by season
- Filter teams by age group
- Rename teams
- Remove teams
- Open a team's roster

Removing a team does not delete the related member or registration records.

### Roster Management

- View a team's roster
- Add registered players to a team
- Move players between eligible teams
- Remove players from a team
- View player contact information
- Search for eligible registered players

Players can only be added when they have a completed registration matching the team's season and age group.

---

## Technology

- HTML
- CSS
- JavaScript
- Browser `localStorage`
- Git
- GitHub

The current prototype does not require a separate database server or external database connection.

---

## Project Structure

```text
WPFC/
│
├── data.js
│
├── team/
│   ├── index.html
│   ├── team.js
│   ├── roster.html
│   ├── roster.js
│   └── mockdata.js
│
├── member/
│   └── ...
│
├── guardian/
│   └── ...
│
└── registration/
    └── ...
