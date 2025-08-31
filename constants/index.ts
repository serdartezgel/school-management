export const sidebarLinks = {
  navMain: [
    {
      title: "MENU",
      items: [
        {
          icon: "/images/home.png",
          label: "Home",
          href: `/`,
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/images/teacher.png",
          label: "Teachers",
          href: "/teachers",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/images/student.png",
          label: "Students",
          href: "/students",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/images/parent.png",
          label: "Parents",
          href: "/parents",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/images/subject.png",
          label: "Subjects",
          href: "/subjects",
          visible: ["admin"],
        },
        {
          icon: "/images/class.png",
          label: "Classes",
          href: "/classes",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/images/lesson.png",
          label: "Lessons",
          href: "/lessons",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/images/exam.png",
          label: "Exams",
          href: "/exams",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/images/assignment.png",
          label: "Assignments",
          href: "/assignments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/images/result.png",
          label: "Results",
          href: "/results",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/images/attendance.png",
          label: "Attendance",
          href: "/attendance",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/images/calendar.png",
          label: "Events",
          href: "/events",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/images/announcement.png",
          label: "Announcements",
          href: "/announcements",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/images/message.png",
          label: "Messages",
          href: "/messages",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
    {
      title: "USER",
      items: [
        {
          icon: "/images/profile.png",
          label: "Profile",
          href: "/profile",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/images/setting.png",
          label: "Settings",
          href: "/settings",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/images/logout.png",
          label: "Logout",
          href: "/logout",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
  ],
};
