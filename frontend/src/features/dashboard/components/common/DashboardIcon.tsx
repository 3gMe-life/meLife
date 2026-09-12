import React from "react";
import {
  LayoutDashboard,
  BookOpenCheck,
  LineChart,
  Compass,
  Users,
  FileText,
  Settings,
  GraduationCap,
  Calendar,
  School,
  Ticket,
  BarChart3,
  CheckSquare,
  Layers,
  Sparkles,
  Trophy,
  BrainCircuit,
  Target,
  Clock,
  ArrowUpRight,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Flame,
  Award,
  Home,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  LayoutDashboard,
  BookOpenCheck,
  LineChart,
  Compass,
  Users,
  FileText,
  Settings,
  GraduationCap,
  Calendar,
  School,
  Ticket,
  BarChart3,
  CheckSquare,
  Layers,
  Sparkles,
  Trophy,
  BrainCircuit,
  Target,
  Clock,
  ArrowUpRight,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Flame,
  Award,
};

interface DashboardIconProps {
  name: string;
  className?: string;
}

export function DashboardIcon({ name, className = "w-5 h-5" }: DashboardIconProps) {
  const IconComponent = ICON_MAP[name] || LayoutDashboard;
  return <IconComponent className={className} />;
}
