
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, HelpCircle, Info } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: React.ReactNode;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  variant = "danger",
  icon,
}: ConfirmationDialogProps) {
  // Determine styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconColor: "text-red-500",
          iconBg: "bg-red-50",
          confirmBg: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          confirmText: "text-white",
          icon: icon || <AlertTriangle className="h-6 w-6" />
        };
      case "warning":
        return {
          iconColor: "text-amber-500",
          iconBg: "bg-amber-50",
          confirmBg: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
          confirmText: "text-white",
          icon: icon || <AlertTriangle className="h-6 w-6" />
        };
      case "info":
      default:
        return {
          iconColor: "text-blue-500",
          iconBg: "bg-blue-50",
          confirmBg: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          confirmText: "text-white",
          icon: icon || <Info className="h-6 w-6" />
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="font-sans max-w-md">
        <AlertDialogHeader className="gap-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${styles.iconBg} ${styles.iconColor} mr-3`}>
              {styles.icon}
            </div>
            <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600 text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel 
            className="font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`font-medium ${styles.confirmBg} ${styles.confirmText}`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
