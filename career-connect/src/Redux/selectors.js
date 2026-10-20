/**
 * Shared helpers so the admin panel and the student portal always work out
 * the same numbers from the same career-server records.
 */

export function getUserProgress(submissions, userId) {
  const own = submissions.filter((item) => item.studentId === userId);
  const completed = own.filter((item) => item.status === "Completed").length;

  return {
    total: own.length,
    completed,
    percentage:
      own.length === 0 ? 0 : Math.round((completed / own.length) * 100),
  };
}

export function getAssignmentProgress(submissions, assignmentId) {
  const own = submissions.filter((item) => item.assignmentId === assignmentId);
  const completed = own.filter((item) => item.status === "Completed").length;

  return {
    total: own.length,
    completed,
    percentage:
      own.length === 0 ? 0 : Math.round((completed / own.length) * 100),
  };
}

export function getCourseProgress(assignments, submissions, course) {
  const courseAssignments = assignments.filter((item) => item.course === course);
  const courseIds = courseAssignments.map((item) => item.id);

  const own = submissions.filter((item) => courseIds.includes(item.assignmentId));
  const completed = own.filter((item) => item.status === "Completed").length;

  return {
    total: courseAssignments.length,
    submitted: own.length,
    completed,
    percentage:
      courseAssignments.length === 0
        ? 0
        : Math.round((completed / courseAssignments.length) * 100),
  };
}

export function getOverallCompletion(submissions) {
  if (submissions.length === 0) return 0;

  const completed = submissions.filter(
    (item) => item.status === "Completed",
  ).length;

  return Math.round((completed / submissions.length) * 100);
}

/**
 * How much of each kind of work a student has finished. The pie chart on the
 * dashboard is built from this.
 */
export function getCompletionOverview(assignments, tasks, projects, user) {
  const mine = (list) =>
    user ? list.filter((item) => item.course === user.course) : [];

  const count = (list) => ({
    done: list.filter((item) => item.status === "Completed").length,
    total: list.length,
  });

  const overview = {
    assignments: count(mine(assignments)),
    tasks: count(mine(tasks)),
    projects: count(mine(projects)),
  };

  const done = overview.assignments.done + overview.tasks.done + overview.projects.done;
  const total = overview.assignments.total + overview.tasks.total + overview.projects.total;

  return {
    ...overview,
    done,
    total,
    percentage: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

/**
 * Exam dates for the student, soonest first, with the days left.
 */
export function getUpcomingExams(exams, user) {
  if (!user) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return exams
    .filter((exam) => exam.course === user.course)
    .map((exam) => {
      const date = new Date(exam.date);
      const days = Math.round((date - today) / 86400000);

      return { ...exam, days };
    })
    .filter((exam) => exam.days >= 0)
    .sort((a, b) => a.days - b.days);
}

export function getOpenTasks(tasks, user) {
  if (!user) return [];

  return tasks
    .filter((task) => task.course === user.course && task.status !== "Completed")
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
}

export function getMyProjects(projects, user) {
  if (!user) return [];

  return projects.filter((project) => project.course === user.course);
}

export function getNotificationsForUser(notifications, user) {
  if (!user) return [];

  return notifications.filter(
    (item) =>
      item.recipientId === user.id ||
      (item.recipientId === null &&
        (item.audience === "All Students" || item.audience === user.course)),
  );
}

export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
