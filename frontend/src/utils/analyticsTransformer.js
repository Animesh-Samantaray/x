/**
 * ANALYTICS TRANSFORMER
 * Pure real-data extraction and aggregation functions for CKM Dashboards.
 * 0 mock data, 0 fake trends, 0 hardcoded metrics.
 */

// Helper to format month key from Date
const formatMonthYear = (dateString) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString("default", { month: "short", year: "2-digit" });
};

// 1. LEARNER ANALYTICS TRANSFORMER
export const transformLearnerAnalytics = (courses = [], progressList = [], bookmarks = [], reviews = [], sessions = []) => {
  const progressMap = {};
  progressList.forEach((p) => {
    const cId = p.course?._id || p.course;
    if (cId) progressMap[cId] = p;
  });

  let completedCount = 0;
  let inProgressCount = 0;
  let notStartedCount = 0;
  let totalUnitsCompleted = 0;
  let totalUnitsAvailable = 0;

  const categoryCounts = {};
  const courseProgressData = [];
  const courseLabels = [];

  courses.forEach((c) => {
    const prog = progressMap[c._id] || {};
    const pct = prog.percentage || 0;
    const completedUnits = prog.completedUnits?.length || 0;
    const totalUnits = c.units?.length || 0;

    totalUnitsCompleted += completedUnits;
    totalUnitsAvailable += totalUnits;

    if (pct === 100) completedCount++;
    else if (pct > 0) inProgressCount++;
    else notStartedCount++;

    const catName = c.category?.name || "General";
    categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;

    courseLabels.push(c.title?.length > 18 ? c.title.substring(0, 18) + "..." : c.title);
    courseProgressData.push(pct);
  });

  const totalEnrolled = courses.length;
  const overallAvgProgress = totalEnrolled > 0
    ? Math.round(courses.reduce((acc, c) => acc + (progressMap[c._id]?.percentage || 0), 0) / totalEnrolled)
    : 0;

  // Chart 1: Course Progress Bar Chart
  const progressChartData = {
    labels: courseLabels,
    datasets: [
      {
        label: "Mastery Percentage (%)",
        data: courseProgressData,
        backgroundColor: "rgba(6, 182, 212, 0.75)",
        borderColor: "#06b6d4",
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  // Chart 2: Course Status Doughnut Chart
  const statusChartData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [completedCount, inProgressCount, notStartedCount],
        backgroundColor: ["#10b981", "#3b82f6", "#64748b"],
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  // Chart 3: Enrolled Categories Distribution
  const categoryLabels = Object.keys(categoryCounts);
  const categoryValues = Object.values(categoryCounts);

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"],
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  return {
    totalEnrolled,
    completedCount,
    inProgressCount,
    notStartedCount,
    totalUnitsCompleted,
    totalUnitsAvailable,
    overallAvgProgress,
    bookmarksCount: bookmarks.length,
    reviewsCount: reviews.length,
    sessionsCount: sessions.length,
    isEmpty: totalEnrolled === 0,
    progressChartData,
    statusChartData,
    categoryChartData,
  };
};

// 2. CREATOR ANALYTICS TRANSFORMER
export const transformCreatorAnalytics = (courses = [], resources = []) => {
  let publishedCount = 0;
  let draftCount = 0;
  let archivedCount = 0;
  let totalLearners = 0;
  let grossRevenue = 0;

  const courseLabels = [];
  const enrollmentCounts = [];
  const categoryCounts = {};

  courses.forEach((c) => {
    const status = c.status || "published";
    if (status === "published") publishedCount++;
    else if (status === "draft") draftCount++;
    else if (status === "archived") archivedCount++;

    const learnersCount = c.enrolledStudents?.length || c.enrollmentCount || 0;
    totalLearners += learnersCount;

    if (status === "published" && c.price) {
      grossRevenue += c.price * learnersCount;
    }

    const catName = typeof c.category === "object" ? c.category?.name : c.category || "General";
    categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;

    courseLabels.push(c.title?.length > 18 ? c.title.substring(0, 18) + "..." : c.title);
    enrollmentCounts.push(learnersCount);
  });

  resources.forEach((r) => {
    const catName = typeof r.category === "object" ? r.category?.name : r.category || "Resources";
    categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
  });

  // Chart 1: Enrollments per Course Bar Chart
  const enrollmentChartData = {
    labels: courseLabels,
    datasets: [
      {
        label: "Enrolled Learners",
        data: enrollmentCounts,
        backgroundColor: "rgba(168, 85, 247, 0.75)",
        borderColor: "#a855f7",
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  // Chart 2: Course Status Breakdown
  const statusChartData = {
    labels: ["Published", "Draft", "Archived"],
    datasets: [
      {
        data: [publishedCount, draftCount, archivedCount],
        backgroundColor: ["#10b981", "#f59e0b", "#f43f5e"],
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  return {
    totalCourses: courses.length,
    publishedCount,
    draftCount,
    archivedCount,
    totalResources: resources.length,
    totalLearners,
    grossRevenue,
    isEmpty: courses.length === 0 && resources.length === 0,
    enrollmentChartData,
    statusChartData,
  };
};

// 3. EXPERT ANALYTICS TRANSFORMER
export const transformExpertAnalytics = (sessions = []) => {
  let openCount = 0;
  let completedCount = 0;
  let cancelledCount = 0;
  let pendingRequests = 0;
  let acceptedRequests = 0;
  let rejectedRequests = 0;

  const monthlyMap = {};

  sessions.forEach((s) => {
    if (s.status === "open") openCount++;
    else if (s.status === "completed") completedCount++;
    else if (s.status === "cancelled") cancelledCount++;

    (s.learners || []).forEach((l) => {
      if (l.status === "pending") pendingRequests++;
      else if (l.status === "accepted") acceptedRequests++;
      else if (l.status === "rejected") rejectedRequests++;
    });

    const mKey = formatMonthYear(s.scheduledAt || s.createdAt);
    monthlyMap[mKey] = (monthlyMap[mKey] || 0) + 1;
  });

  const monthLabels = Object.keys(monthlyMap);
  const monthCounts = Object.values(monthlyMap);

  // Chart 1: Monthly Sessions Line Chart
  const monthlyChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Sessions Scheduled",
        data: monthCounts,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  // Chart 2: Session Requests Breakdown Doughnut Chart
  const requestsChartData = {
    labels: ["Accepted", "Pending Requests", "Rejected"],
    datasets: [
      {
        data: [acceptedRequests, pendingRequests, rejectedRequests],
        backgroundColor: ["#10b981", "#f59e0b", "#f43f5e"],
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  const sessionStatusChartData = {
    labels: ["Open Slots", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Sessions",
        data: [openCount, completedCount, cancelledCount],
        backgroundColor: ["#06b6d4", "#a855f7", "#64748b"],
        borderColor: "#0f172a",
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  return {
    totalSessions: sessions.length,
    openCount,
    completedCount,
    cancelledCount,
    pendingRequests,
    acceptedRequests,
    rejectedRequests,
    isEmpty: sessions.length === 0,
    monthlyChartData,
    requestsChartData,
    sessionStatusChartData,
  };
};

// 4. ADMIN ANALYTICS TRANSFORMER
export const transformAdminAnalytics = (users = [], reports = [], categories = []) => {
  let learnersCount = 0;
  let creatorsCount = 0;
  let expertsCount = 0;
  let adminsCount = 0;

  const monthRegistrationMap = {};

  users.forEach((u) => {
    if (u.role === "learner") learnersCount++;
    else if (u.role === "creator") creatorsCount++;
    else if (u.role === "expert") expertsCount++;
    else if (u.role === "admin") adminsCount++;

    const mKey = formatMonthYear(u.createdAt);
    monthRegistrationMap[mKey] = (monthRegistrationMap[mKey] || 0) + 1;
  });

  let pendingReports = 0;
  let reviewingReports = 0;
  let resolvedReports = 0;

  reports.forEach((r) => {
    if (r.status === "pending") pendingReports++;
    else if (r.status === "reviewing") reviewingReports++;
    else if (r.status === "resolved") resolvedReports++;
  });

  const regMonthLabels = Object.keys(monthRegistrationMap);
  const regMonthCounts = Object.values(monthRegistrationMap);

  // Chart 1: Real User Registrations Timeline
  const userGrowthChartData = {
    labels: regMonthLabels,
    datasets: [
      {
        label: "New User Registrations",
        data: regMonthCounts,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Chart 2: User Roles Distribution Doughnut Chart
  const rolesChartData = {
    labels: ["Learners", "Creators", "Experts", "Admins"],
    datasets: [
      {
        data: [learnersCount, creatorsCount, expertsCount, adminsCount],
        backgroundColor: ["#3b82f6", "#a855f7", "#10b981", "#f59e0b"],
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  // Chart 3: Moderation Reports Status
  const reportsChartData = {
    labels: ["Pending", "Reviewing", "Resolved"],
    datasets: [
      {
        data: [pendingReports, reviewingReports, resolvedReports],
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"],
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  return {
    totalUsers: users.length,
    learnersCount,
    creatorsCount,
    expertsCount,
    adminsCount,
    activeUsersCount: users.length,
    totalReports: reports.length,
    pendingReports,
    categoriesCount: categories.length,
    isEmpty: users.length === 0,
    userGrowthChartData,
    rolesChartData,
    reportsChartData,
  };
};
