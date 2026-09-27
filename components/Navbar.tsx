"use client";

import { ALL_MODELS, AUTO_MODEL } from "@/lib/ai/models";
import { DashboardLayout } from "./layout";

export const AVAILABLE_MODELS = [AUTO_MODEL, ...ALL_MODELS];
export { DashboardLayout, Sidebar, TopHeader } from "./layout";
export default DashboardLayout;
