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
