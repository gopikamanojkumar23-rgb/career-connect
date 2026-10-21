# CareerConnect

A career guidance platform where students manage their assignments and admins
run the whole thing. Both sides read and write the same records, so a change
made in the admin panel shows up in the student portal straight away.

## Project layout

```
career-connect/     React frontend (Vite)
career-server/     json-server API on port 3000
```

The API stores eight collections in `career-server/db.json`:

| Collection     | Used by                                        |
| -------------- | ---------------------------------------------- |
| `users`        | logins, the admin users page, profiles         |
| `assignments`  | assignments page, a student's task list        |
| `submissions`  | the review queue, submit work, progress        |
| `notifications`| announcements for students and admins          |
| `tasks`        | the small steps on a student's dashboard       |
| `projects`     | what a student is building                     |
| `exams`        | exam dates, times and venues                   |
| `feedback`     | what students tell the admin, and the replies  |

## Running it

Two terminals, the API first:

```bash
cd career-server
npm install
npm start          # http://localhost:3000
```

```bash
cd career-connect
npm install
npm run dev        # http://localhost:5173
```

`npm run build` creates a production bundle and `npm run lint` checks the code.

## Environment variables

Both are optional, the app runs without a `.env` file.

| Variable                | Default                 | What it does                                  |
| ----------------------- | ----------------------- | --------------------------------------------- |
| `VITE_API_URL`          | `http://localhost:3000` | where the career-server api lives             |
| `VITE_GOOGLE_CLIENT_ID` | empty                   | client id that turns the Google sign in on    |

`VITE_GOOGLE_CLIENT_ID` comes from
[Google Cloud credentials](https://console.cloud.google.com/apis/credentials).
Without it the login page hides the Google button and shows the email and
password form only.

## Signing in

| Role    | Email                      | Password    |
| ------- | -------------------------- | ----------- |
| Admin   | `admin@careerconnect.com`  | `admin123`  |
| Student | `aarav.menon@example.com`  | `aarav123`  |

## Signing in

| Role    | Email                      | Password    |
| ------- | -------------------------- | ----------- |
| Admin   | `admin@careerconnect.com`  | `admin123`  |
| Student | `aarav.menon@example.com`  | `aarav123`  |

The register page lets you pick **Student** or **Admin**, and the role is
saved on the account, so you land on the matching dashboard after signing in.
Google sign-in reuses an existing account when the email matches, and creates
a student account otherwise.

## How the two sides stay in sync

`src/Redux/Slice` holds one slice per collection (`userSlice`, `authSlice`,
`assignmentSlice`, `submissionSlice`, `notificationSlice`, `studentSlice`,
`feedbackSlice`). The slices own the api calls and the pages only read from
the store.

`src/Redux/selectors.js` has the shared maths, so the admin panel and the
student portal always work out the same progress numbers from the same rows.

`AdminLayout` and `UserLayout` load the collections when they mount, so every
page under them works on fresh data.

Note that json-server replaces the whole record on `PUT`, so every update
slice reads the record first and sends the merged version back. Otherwise a
partial update like `status` would wipe the other fields.

## Structure

```
src/
  Admin/
    Components/   AdminHeader, AdminSidebar, AdminLayout, AdminUI
    Pages/        Dashboard, Users, Assignments, Study Plan, Submissions,
                  Progress, Notifications, Feedback, Reports
  User/
    Components/   UserHeader, UserSidebar, UserLayout
    Pages/        Dashboard, MyAssignments, MyProgress, Notifications,
                  MyFeedback, Profile, SubmitWork
  Components/    ProtectedRoute
  Pages/         Home, Login, Register
  Redux/
    Slice/        one slice per collection
    selectors.js  shared progress and formatting helpers
    store.js      store setup and session persistence
  Services/      api.js, the axios instance
```
