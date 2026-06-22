# TaskFlow — PRITECH React Native Technical Task

A clean, fully-featured personal task manager built with React Native (Expo) and TypeScript.

---

## Features

| Feature | Status |
|---|---|
| Task list screen | ✅ |
| Add new task | ✅ |
| Edit existing task | ✅ |
| Mark task as completed / pending | ✅ |
| Delete task (with confirmation) | ✅ |
| Task detail view | ✅ |
| Input validation | ✅ |
| Search tasks by title | ✅ Bonus |
| Filter by status (All / Pending / Done) | ✅ Bonus |
| Local persistence (AsyncStorage) | ✅ Bonus |
| Navigation between screens | ✅ Bonus |
| Public API integration | ✅ Quotable.io |

---

## Tech Stack

- **React Native** with **Expo SDK 51**
- **TypeScript** — strict mode
- **React Navigation v6** — native stack navigator
- **AsyncStorage** — local persistence across app restarts
- **React Context + useReducer** — global state management
- **Quotable.io API** — motivational quotes on the task detail screen

---

## Setup & Running

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — install with `npm install -g expo-cli`
- [Expo Go](https://expo.dev/client) app on your phone (iOS or Android), or an emulator

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd pritech-task-manager

# 2. Install dependencies
npm install

# 3. Start the development server
npm start

# 4. Open in Expo Go
# Scan the QR code with Expo Go (Android) or the Camera app (iOS)
```

### Running on a specific platform

```bash
npm run android   # Android emulator or device
npm run ios       # iOS simulator (macOS only)
npm run web       # Web browser
```

---

## What was implemented

### Architecture

The app follows a clean, scalable structure:

```
src/
├── components/     Reusable UI: TaskCard, SearchBar, FilterChips, EmptyState
├── context/        TaskContext — global state via useReducer + AsyncStorage sync
├── navigation/     AppNavigator — React Navigation native stack
├── screens/        TaskListScreen, TaskDetailScreen, AddEditTaskScreen
├── services/       api.ts — Quotable.io integration
├── types/          TypeScript interfaces (Task, Quote, navigation types)
└── utils/          storage.ts (AsyncStorage), helpers.ts (ID, date formatting)
```

### State management

A single `TaskContext` backed by `useReducer` manages all task state. Every state change is automatically persisted to `AsyncStorage` so tasks survive app restarts. The context exposes memoised action callbacks to prevent unnecessary re-renders.

### Public API

The **Task Detail screen** fetches a random motivational quote from [Quotable.io](https://api.quotable.io) each time it opens. Errors are handled gracefully with a fallback message — the screen never crashes due to network issues.

### UI highlights

- **Progress bar** in the header shows completion percentage at a glance
- **Animated press feedback** on task cards (spring scale animation)
- **Color-coded** accent bars and status badges (indigo = pending, green = done)
- **Character counters** on form inputs with warning colour at the limit
- **Unsaved-changes guard** — the Add/Edit screen prompts before discarding

### Validation

- Title is required and must be at least 3 characters
- Error messages appear on blur or on attempted save
- Save button is visually disabled when the form is invalid

---

## Project structure

```
.
├── App.tsx                 Entry point
├── app.json                Expo configuration
├── babel.config.js
├── package.json
├── tsconfig.json
└── src/
    ├── components/
    │   ├── theme.ts        Design tokens (colors, spacing, shadows)
    │   ├── TaskCard.tsx
    │   ├── SearchBar.tsx
    │   ├── FilterChip.tsx
    │   └── EmptyState.tsx
    ├── context/
    │   └── TaskContext.tsx
    ├── navigation/
    │   └── AppNavigator.tsx
    ├── screens/
    │   ├── TaskListScreen.tsx
    │   ├── TaskDetailScreen.tsx
    │   └── AddEditTaskScreen.tsx
    ├── services/
    │   └── api.ts
    ├── types/
    │   └── index.ts
    └── utils/
        ├── storage.ts
        └── helpers.ts
```
