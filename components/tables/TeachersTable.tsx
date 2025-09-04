"use client";

import { Role } from "@/prisma/client";

import { getTeacherColumns } from "./columns";
import DataTable from "./DataTable";

const data = [
  {
    userId: 1,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Alice Johnson",
    employeeId: "EMP1001",
    email: "alice.johnson@example.com",
    department: "Mathematics",
    subjects: ["Algebra", "Calculus", "Geometry"],
    classes: ["Grade 9", "Grade 10"],
    phone: "555-1010",
    address: "123 Maple St",
  },
  {
    userId: 2,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bob Smith",
    employeeId: "EMP1002",
    email: "bob.smith@example.com",
    department: "Physics",
    subjects: ["Mechanics", "Optics", "Thermodynamics"],
    classes: ["Grade 11", "Grade 12"],
    phone: "555-1020",
    address: "456 Oak Ave",
  },
  {
    userId: 3,
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Clara Davis",
    employeeId: "EMP1003",
    email: "clara.davis@example.com",
    department: "Chemistry",
    subjects: ["Organic Chemistry", "Inorganic Chemistry"],
    classes: ["Grade 10", "Grade 11"],
    phone: "555-1030",
    address: "789 Pine Rd",
  },
  {
    userId: 4,
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "David Lee",
    employeeId: "EMP1004",
    email: "david.lee@example.com",
    department: "Biology",
    subjects: ["Anatomy", "Genetics", "Ecology"],
    classes: ["Grade 9", "Grade 12"],
    phone: "555-1040",
    address: "321 Birch Blvd",
  },
  {
    userId: 5,
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Ella Martinez",
    employeeId: "EMP1005",
    email: "ella.martinez@example.com",
    department: "English",
    subjects: ["Literature", "Grammar", "Writing"],
    classes: ["Grade 9", "Grade 10"],
    phone: "555-1050",
    address: "654 Cedar St",
  },
  {
    userId: 6,
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    name: "Frank Wilson",
    employeeId: "EMP1006",
    email: "frank.wilson@example.com",
    department: "History",
    subjects: ["World History", "Modern History"],
    classes: ["Grade 11", "Grade 12"],
    phone: "555-1060",
    address: "987 Spruce Ln",
  },
  {
    userId: 7,
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    name: "Grace Kim",
    employeeId: "EMP1007",
    email: "grace.kim@example.com",
    department: "Mathematics",
    subjects: ["Statistics", "Probability"],
    classes: ["Grade 9", "Grade 11"],
    phone: "555-1070",
    address: "246 Elm Dr",
  },
  {
    userId: 8,
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    name: "Henry Brown",
    employeeId: "EMP1008",
    email: "henry.brown@example.com",
    department: "Physics",
    subjects: ["Electromagnetism", "Quantum Physics"],
    classes: ["Grade 10", "Grade 12"],
    phone: "555-1080",
    address: "135 Willow Way",
  },
  {
    userId: 9,
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    name: "Isabella White",
    employeeId: "EMP1009",
    email: "isabella.white@example.com",
    department: "Chemistry",
    subjects: ["Physical Chemistry", "Biochemistry"],
    classes: ["Grade 10", "Grade 11"],
    phone: "555-1090",
    address: "864 Aspen Ct",
  },
  {
    userId: 10,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    name: "Jack Thompson",
    employeeId: "EMP1010",
    email: "jack.thompson@example.com",
    department: "Biology",
    subjects: ["Microbiology", "Ecology"],
    classes: ["Grade 9", "Grade 12"],
    phone: "555-1100",
    address: "753 Poplar Pl",
  },
];

const TeachersTable = ({ role }: { role: Role }) => {
  const columns = getTeacherColumns(role);

  return <DataTable columns={columns} data={data} />;
};

export default TeachersTable;
