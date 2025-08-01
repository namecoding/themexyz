import { useState, useEffect } from "react";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button"

export default function PurchaseToast({ purchase }) {
  const [showToast, setShowToast] = useState(false);

  const toggleToast = () => setShowToast((prev) => !prev);

  // Optional: Auto-dismiss after 5 seconds
//   useEffect(() => {
//     if (showToast) {
//       const timer = setTimeout(() => setShowToast(false), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [showToast]);

  return (
    <div className="relative">
      <Button
        onClick={toggleToast}
        className="text-xs"
        variant="outline"
      >
        <FileText className="h-3 w-3" />
        More
      </Button>

      

      {showToast && (
        <div className="fixed z-50 max-w-xs w-full bg-white border border-gray-200 rounded-lg shadow-lg animate-slide-in">
          <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50 rounded-t-lg">
            <span className="text-sm font-medium">Purchase Info</span>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 text-sm text-gray-700">
            {purchase.title}
          </div>
        </div>
      )}
    </div>
  );
}
