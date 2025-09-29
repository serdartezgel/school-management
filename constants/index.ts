export const sidebarLinks = {
  title: "MENU",
  items: [
    {
      icon: "/images/home.png",
      label: "Home",
      href: `/`,
      visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
    {
      icon: "/images/teacher.png",
      label: "Teachers",
      href: "/teachers",
      visible: ["ADMIN", "TEACHER"],
    },
    {
      icon: "/images/student.png",
      label: "Students",
      href: "/students",
      visible: ["ADMIN", "TEACHER"],
    },
    {
      icon: "/images/parent.png",
      label: "Parents",
      href: "/parents",
      visible: ["ADMIN", "TEACHER"],
    },
    {
      icon: "/images/class.png",
      label: "Classes",
      href: "/classes",
      visible: ["ADMIN", "TEACHER"],
    },
    {
      icon: "/images/subject.png",
      label: "Subjects",
      href: "/subjects",
      visible: ["ADMIN"],
    },
    {
      icon: "/images/attendance.png",
      label: "Attendance",
      href: "/attendance",
      visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
    {
      icon: "/images/exam.png",
      label: "Exams",
      href: "/exams",
      visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
    {
      icon: "/images/assignment.png",
      label: "Assignments",
      href: "/assignments",
      visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
    {
      icon: "/images/result.png",
      label: "Grades",
      href: "/grades",
      visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
    {
      icon: "/images/calendar.png",
      label: "Events",
      href: "/events",
      visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
    {
      icon: "/images/announcement.png",
      label: "Announcements",
      href: "/announcements",
      visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
    {
      icon: "/images/message.png",
      label: "Messages",
      href: "/messages",
      visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
  ],
};
