import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TaskList from "@/components/task/task-list/TaskList";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "VADO Task List",
  description:
    "This is Task List Page",
  // other metadata
};

export default function TaskListPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Task List" />
      <TaskList />
    </div>
  );
}
