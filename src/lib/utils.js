import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper function to merge Tailwind CSS classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date to readable format
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Get user initials for avatar
export function getUserInitials(name) {
  if (!name) return '';
  
  const names = name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  
  return name.substring(0, 2).toUpperCase();
}

// Get priority level color
export function getPriorityColor(priority) {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

// Get status color
export function getStatusColor(status) {
  switch (status) {
    case 'todo':
      return 'bg-gray-200';
    case 'in-progress':
      return 'bg-blue-200';
    case 'done':
      return 'bg-green-200';
    default:
      return 'bg-gray-200';
  }
}