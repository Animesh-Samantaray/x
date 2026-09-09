# CKM Frontend Audit

## 1. Current Architecture
The Collaborative Knowledge Marketplace (CKM) frontend is built on **React 19** with **Vite 8** as the build tool and **React Router DOM 7** for routing. 
- **State Management**: Uses React Context (`frontend/src/context/AuthContext.jsx`) for global authentication state, active user profile, login/logout actions, and token storage (`localStorage`).
- **Layout Shell**: Implemented via `frontend/src/layouts/MainLayout.jsx`, which conditionally checks `isAuthenticated` and `user.role`. For authenticated users, it renders a fixed side navigation bar ([`Sidebar.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/layout/Sidebar.jsx)) offset by `lg:ml-[260px]`. For guest users, it renders a top header ([`Navbar.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/Navbar.jsx)) and [`Footer.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/Footer.jsx). An alternative shell [`AppShell.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/AppShell.jsx) exists with top-bar navigation and Socket.IO notification listeners.
- **Styling Paradigm**: Uses **Tailwind CSS v4** (`@tailwindcss/vite`) with custom CSS utility rules and keyframe animations defined in [`index.css`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/index.css).
- **Icons & Motion**: Icons supplied by `lucide-react`. Micro-animations and page transitions powered by `framer-motion` v13.

## 2. Complete Route Map
All routes are declared in [`App.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/App.jsx) wrapped inside [`MainLayout.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/layouts/MainLayout.jsx):

### Unauthenticated Public Routes
- `/` -> [`Landing.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Landing.jsx) (Public marketplace landing page)
- `/login` -> [`Login.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Login.jsx) (Credentials & Google OAuth login)
- `/signup` -> [`Signup.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Signup.jsx) (Role selection and user registration)
- `/verify-2fa` -> [`Verify2FA.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Verify2FA.jsx) (OTP authentication step)

### Protected General & Role Routes (`ProtectedRoute.jsx`)
- `/dashboard` -> [`DashboardRedirect.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/DashboardRedirect.jsx) (Redirects to role-specific dashboard based on `user.role`)
- `/learner/dashboard` -> [`LearnerDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/LearnerDashboard.jsx) (`role="learner"`)
- `/creator/dashboard` -> [`CreatorDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/CreatorDashboard.jsx) (`role="creator"`)
- `/expert/dashboard` -> [`ExpertDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/ExpertDashboard.jsx) (`role="expert"`)
- `/admin/dashboard` -> [`AdminDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/AdminDashboard.jsx) (`role="admin"`)
- `/admin/payments` -> [`AdminPaymentsPage.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/AdminPaymentsPage.jsx) (`role="admin"`)
- `/admin/reports` -> [`ReportsManagement.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/admin/ReportsManagement.jsx) (`role="admin"`)

### Protected Shared Workspace Routes
- `/profile` -> [`Profile.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Profile.jsx) (User profile management, bio, avatar, security settings)
- `/resources` -> [`Resources.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Resources.jsx) (Explore knowledge resources & documents)
- `/my-resources` -> [`MyResources.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/MyResources.jsx) (Authoring & managing uploaded resources)
- `/resources/:id` -> [`ResourceDetail.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/ResourceDetail.jsx) (Document preview & download)
- `/resources/new` -> [`CreateResource.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/CreateResource.jsx) (Resource upload form)
- `/resources/edit/:id` -> [`EditResource.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/EditResource.jsx) (Resource editor form)
- `/categories` -> [`Categories.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Categories.jsx) (Taxonomy & category management)
- `/courses` -> [`ExploreCourses.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/ExploreCourses.jsx) (Browse courses catalog)
- `/courses/new` -> [`CreateCourse.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/CreateCourse.jsx) (Course creation wizard)
- `/courses/edit/:id` -> [`EditCourse.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/EditCourse.jsx) (Course metadata editor)
- `/courses/:id` -> [`CourseDetail.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/CourseDetail.jsx) (Course landing & syllabus)
- `/courses/:id/manage` -> [`CourseManage.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/CourseManage.jsx) (Curriculum builder & unit manager)
- `/courses/:id/learn` -> [`CourseLearn.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/CourseLearn.jsx) (Interactive unit viewer & video player)
- `/my-courses` -> [`MyCourses.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/MyCourses.jsx) (Role-specific course inventory)
- `/my-learning` -> [`LearnerMyLearning.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/LearnerMyLearning.jsx) (Enrolled courses & progress)
- `/bookmarks` -> [`MyBookmarks.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/MyBookmarks.jsx) (Saved course resources)
- `/sessions` & `/sessions/:id` -> [`SessionsPage.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/sessions/SessionsPage.jsx) (Mentorship booking & scheduling)
- `/chat` -> [`Chat.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Chat.jsx) (Real-time Socket.IO messaging & reactions)
- `/my-payments` & `/payments` -> [`PaymentHistory.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/PaymentHistory.jsx) (Transactions & payouts)
- `/reports` -> [`MyReports.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/MyReports.jsx) (User-submitted content reports)

## 3. Authentication & Authorization Flow
- **Auth Provider**: [`AuthContext.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/context/AuthContext.jsx) manages `user`, `loading`, `token`.
- **JWT Storage**: JWT token saved in `localStorage.getItem("token")` and attached as `Bearer <token>` via Axios interceptor in [`api.js`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/services/api.js).
- **Route Guard**: [`ProtectedRoute.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/ProtectedRoute.jsx) verifies `isAuthenticated` and checks `role`. If `role` is specified and user role does not match, redirects to user's matching dashboard or login.
- **2FA Support**: Login flow redirects to `/verify-2fa` when `twoFactorRequired: true`. Toggleable in profile and sidebar via [`update2FA`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/services/authService.js).

## 4. Role-Based Navigation
- Current navigation structure relies on fixed role configurations inside [`Sidebar.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/layout/Sidebar.jsx).
- **Learner**: Home, Catalog, Library, Mentorship, Discussions, Enrolled Courses, Saved Resources, Payments, Reports, Profile.
- **Creator**: Creator Studio, Catalog, Discussions, Course Authoring, Resource Library, Categories, Payments, Reports, Profile.
- **Expert**: Expert Hub, Mentorship Hub, Discussions, Courses, Resources, Categories, Payments, Reports, Profile.
- **Admin**: Admin Operations, Moderation Queue, Payment Platform, User Directory, Course Catalog, Resource Library, Categories, Discussions, Profile.

## 5. Page Inventory
1. [`Landing.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Landing.jsx) (63.4 KB) - Standard marketing layout with hero, node diagram, categories grid, role cards, learning ring preview, featured resources, expert discovery.
2. [`LearnerDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/LearnerDashboard.jsx) (44.8 KB) - Learner statistics, active course progress, bookmarked items, upcoming mentorship calls, tabbed sub-views.
3. [`CreatorDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/CreatorDashboard.jsx) (27.9 KB) - Course authoring statistics, course drafts, content sales, category breakdown.
4. [`ExpertDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/ExpertDashboard.jsx) (28.6 KB) - Session requests queue, upcoming sessions, earnings, availability settings.
5. [`AdminDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/AdminDashboard.jsx) (31.7 KB) - System stats, User directory tab, platform courses, resources, category editor.
6. [`CourseDetail.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/CourseDetail.jsx) (23.4 KB) - Course landing page with syllabus, reviews, instructor info, enrollment button.
7. [`CourseLearn.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/CourseLearn.jsx) (23.5 KB) - Unit player sidebar + main content/video player + attachments & unit completion button.
8. [`CourseManage.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/CourseManage.jsx) (16.4 KB) - Unit creation form, unit re-ordering, content editor.
9. [`CreateCourse.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/CreateCourse.jsx) & [`EditCourse.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/EditCourse.jsx) - Metadata & thumbnail upload forms.
10. [`ExploreCourses.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/ExploreCourses.jsx) (5.7 KB) & [`MyCourses.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/courses/MyCourses.jsx) (9.3 KB) - Course grid listings.
11. [`Resources.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Resources.jsx) (11.0 KB), [`MyResources.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/MyResources.jsx) (16.5 KB), [`ResourceDetail.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/ResourceDetail.jsx) (13.5 KB), [`CreateResource.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/CreateResource.jsx) (20.8 KB), [`EditResource.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/EditResource.jsx) (23.7 KB).
12. [`SessionsPage.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/sessions/SessionsPage.jsx) (18.3 KB) - Expert session discovery, slot booking modal, session status tracking.
13. [`Chat.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Chat.jsx) (11.1 KB) - Conversation sidebar, message history, live Socket.io messaging, reactions.
14. [`ReportsManagement.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/admin/ReportsManagement.jsx) (27.2 KB) & [`MyReports.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/MyReports.jsx) (7.4 KB) - Moderation report list & status updating.
15. [`AdminPaymentsPage.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/AdminPaymentsPage.jsx) (21.8 KB) & [`PaymentHistory.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/PaymentHistory.jsx) (17.4 KB) - Financial transactions and payouts.
16. [`Profile.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Profile.jsx) (32.4 KB) - User profile & settings page.
17. [`Categories.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Categories.jsx) (23.4 KB) - Category management.
18. [`Login.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Login.jsx), [`Signup.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Signup.jsx), [`Verify2FA.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Verify2FA.jsx).

## 6. Component Inventory
- **Layout Components**: `Sidebar.jsx`, `Navbar.jsx`, `Footer.jsx`, `DashboardLayout.jsx`.
- **Card Primitives**: `SpotlightCard.jsx`, `GlassCard.jsx`, `StatCard.jsx`, `CourseCard.jsx`, `ReviewCard.jsx`, `SessionCard.jsx`.
- **UI Elements**: `Button.jsx`, `ProgressRing.jsx`, `Loading.jsx`, `LoadingSkeleton.jsx`, `EmptyState.jsx`, `ErrorState.jsx`, `Sticker.jsx`, `LottieAnimation.jsx`.
- **Domain Components**: `UserManagement.jsx`, `DateTimePicker.jsx`, `ChatWindow.jsx`, `MessageList.jsx`, `ConversationList.jsx`.

## 7. API & Data Flow
All API calls are routed through service wrappers in `frontend/src/services/`:
- `api.js`: Base Axios instance with `baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"` and JWT header interceptor.
- Services: `authApi`, `authService`, `courseService`, `unitService`, `resourceService`, `sessionService`, `bookmarkService`, `reviewService`, `progressService`, `paymentService`, `categoryService`, `reportApi`, `chatService`, `socket.js`, `adminApi`, `creatorApi`, `expertApi`, `learnerApi`.
- **Strict Constraint**: API contracts, endpoint URLs, and response structures MUST NOT be broken during the redesign.

## 8. Current Design System
- **Colors**: Heavy reliance on generic dark slate backgrounds (`bg-slate-950`, `bg-slate-900`) combined with saturated cyan (`#06b6d4`), purple (`#a855f7`), and orange accent glows.
- **Bento & Glassmorphism**: High density of rounded containers (`rounded-2xl`, `rounded-3xl`) with glossy glass borders (`border-white/10`, `glass-surface`).
- **Typography**: Relies on browser default sans fonts (`font-sans`) and monospace font rules without a distinct signature typographic hierarchy.
- **Theme**: Basic class-based dark/light toggle in `localStorage`, but light theme currently feels like a harsh white inversion of the dark mode without dedicated surface tokens.

## 9. Responsive Implementation
- Desktop uses multi-column bento grids and fixed 260px left sidebar.
- Mobile collapses sidebar into a slide-over drawer triggered by a top mobile header (`lg:hidden`).
- Some dense tables and bento cells cause slight horizontal overflow on mobile screens (<375px).

## 10. Current UX Problems
1. **Card Overuse & Container Fatigue**: Almost every piece of information, metric, button, list item, and banner is enclosed in a rounded, bordered card container.
2. **Predictable Layout Structure**: Dashboards follow a formulaic row of statistic cards followed by a grid of course cards.
3. **Generic SaaS aesthetic**: Saturated neon glowing mesh background orbs on dark slate can feel like a boilerplate template.
4. **Weak Typographic Contrast**: Sub-headings and body text lack editorial weight and proportional scaling.
5. **Sidebar Friction**: The fixed sidebar consumes 260px of screen real estate with repetitive role sections, restricting content workspace width.

## 11. Repeated / Generic UI Patterns
- Metric Cards: Icon in top right + numeric value + percentage change text.
- Course Cards: Thumbnail banner + category pill + title + instructor avatar + price + button.
- Floating Glowing Orbs: Abstract fixed background blurs.

## 12. Components to Preserve
- **Core State & Auth Logic**: [`AuthContext.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/context/AuthContext.jsx) & [`ProtectedRoute.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/ProtectedRoute.jsx).
- **Service Layer**: All files in `frontend/src/services/` (`api.js`, `courseService.js`, `sessionService.js`, `chatService.js`, `socket.js`, etc.).
- **Interactive Functional Components**: Socket chat handlers, unit player video embedding, 2FA input handlers, date-time pickers, upload forms.

## 13. Components to Replace
- [`MainLayout.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/layouts/MainLayout.jsx) & [`Sidebar.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/layout/Sidebar.jsx): Replace with a modern, high-end Workspace Application Shell with contextual header navigation, command palette, and sleek left workspace bar.
- [`Navbar.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/Navbar.jsx) & [`Footer.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/Footer.jsx): Replace with editorial navigation bar and modern footer.
- [`Landing.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/Landing.jsx): Completely restructure landing page into an editorial, high-converting knowledge marketplace narrative.
- Role Dashboards ([`LearnerDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/LearnerDashboard.jsx), [`CreatorDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/CreatorDashboard.jsx), [`ExpertDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/ExpertDashboard.jsx), [`AdminDashboard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/pages/dashboards/AdminDashboard.jsx)): Replace template bento grids with specialized operational workspaces.
- Design Primitives ([`SpotlightCard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/SpotlightCard.jsx), [`StatCard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/dashboard/StatCard.jsx), [`GlassCard.jsx`](file:///d:/SHNOOR/Collaborative_Knowledge_Marketplace/frontend/src/components/GlassCard.jsx)): Replace container-heavy cards with structured list rows, timelines, side panels, and borderless editorial layouts.

## 14. Functionality That Must Not Break
- Full JWT authentication & 2FA verification.
- Google OAuth login flow.
- Role-based authorization & dashboard routing.
- Real-time Socket.IO chat messaging, unread counts, desktop notifications, and reactions.
- Course enrollment, progress updating, unit completion toggles, and certificate generation.
- Resource creation, editing, file attachments, and bookmarking.
- Mentorship session creation, request queueing, accept/reject status transitions, and video meeting URLs.
- Admin user directory management, role updates, content deletion, reports queue resolution, and payout tracking.
- Light/Dark theme toggling.

## 15. New Design Opportunities
- **Distinctive Typography**: Introduce Google Fonts **Outfit** (for bold, geometric headings & numbers) and **Plus Jakarta Sans** (for clean body copy) to replace standard web defaults.
- **Editorial Knowledge Aesthetics**: Deep rich Obsidian / Charcoal surfaces (`#090A0F`, `#12131A`) for Dark mode, and warm Alabaster / Milk surfaces (`#F8F9FA`, `#F0F2f5`) for Light mode.
- **Contextual Rails & Horizontal Timelines**: Replace card grids with horizontal content rails, interactive status timelines, master-detail split views, and compact analytics lists.
- **Seamless Framer Motion System**: Smooth page entry transitions, layout tab morphs, staggered list reveals, hover micro-interactions, and slide-in context panels.

## 16. Proposed New Information Architecture
- **Global Shell**:
  - Top Workspace Bar: Quick search / Command trigger, contextual breadcrumbs, role badge, theme toggle, notifications drawer, user avatar dropdown.
  - Workspace Rail (Slim Collapsible Rail): Fast switching between Workspace Home, Catalog, Knowledge Library, Mentorship Workspace, Discussions, and Account Operations.
- **Role-Specific Workspace Views**:
  - **Learner Workspace**: Hero active learning rail -> Learning timeline & next unit CTA -> Horizontal enrolled courses rail -> Bookmarks & upcoming mentorship schedule split view.
  - **Creator Content Studio**: Authoring telemetry summary -> Drafts & live courses list -> Curriculum builder panel -> Payout & engagement analytics list.
  - **Expert Mentorship Hub**: Live availability toggle -> Session request queue (Master-Detail layout) -> Upcoming calls timeline -> Active learners list.
  - **Admin Operations Center**: Platform health metrics summary -> User management split directory -> Moderation reports queue -> Financial payout auditor.
- **Content Experiences**:
  - **Course Discovery**: Asymmetric featured hero + horizontal filter bar + list/card composite rows.
  - **Course Learning Player**: Focus-mode layout with collapsible syllabus rail, main video canvas, tabs for discussion/attachments/notes, and unit completion indicator.
  - **Knowledge Library**: Dense document list with type pills, bookmark buttons, category filters, and quick drawer preview.
  - **Mentorship Hub**: Expert schedule grid + interactive request drawer + step-by-step session lifecycle timeline.

## 17. Proposed New Navigation Structure
- **Primary Rail Navigation**:
  - `Workspace` (Role Dashboard)
  - `Explore Catalog` (`/courses`)
  - `Knowledge Library` (`/resources`)
  - `1-on-1 Mentorship` (`/sessions`)
  - `Discussions` (`/chat` with live unread badge)
- **Role-Specific Quick Drawer / Sub-nav**:
  - Learner: My Learning (`/my-learning`), Bookmarks (`/bookmarks`), Payments (`/my-payments`).
  - Creator: My Studio (`/creator/dashboard`), Authoring (`/my-courses`), Resources (`/my-resources`), Categories (`/categories`).
  - Expert: Mentorship Hub (`/sessions`), Courses (`/my-courses`), Resources (`/my-resources`).
  - Admin: Operations (`/admin/dashboard`), Moderation (`/admin/reports`), Payments (`/admin/payments`), Users Directory (`/admin/dashboard?tab=users`).
- **User Identity & Utilities**:
  - Top right profile trigger: Profile (`/profile`), Security (2FA toggle), Theme switcher, Logout.
