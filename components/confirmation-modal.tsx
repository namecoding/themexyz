"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmationModalProps {
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  isDestructive?: boolean
}

export default function ConfirmationModal({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-start mb-4">
            {isDestructive && (
              <div className="mr-3 flex-shrink-0">
                <div className="bg-red-100 rounded-full p-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{message}</p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button
              className={
                isDestructive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-[#82b440] hover:bg-[#7aa93c] text-white"
              }
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
