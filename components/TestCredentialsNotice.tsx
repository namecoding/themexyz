// components/TestCredentialsNotice.tsx
import React from "react";
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
} from "lucide-react"

type LoginDetail = {
  username: string;
  password: string;
  description: string;
  urlType: "demo" | "admin";
  url?: string; // optional in case you want a link
};

interface TestCredentialsNoticeProps {
  loginDetails?: LoginDetail[];
  demoUrl:string
  onPreview?: () => void;
}

const TestCredentialsNotice: React.FC<TestCredentialsNoticeProps> = ({ loginDetails, demoUrl, onPreview }) => {
  if (!loginDetails || loginDetails.length === 0) return null;

  const demo = loginDetails.find((item) => item.urlType === "demo");
  const admin = loginDetails.find((item) => item.urlType === "admin");

  return (
    <div className="w-full bg-green-50 rounded-md p-4 shadow-sm mb-4">
      <h2 className="text-green-500 font-semibold text-sm mb-3">
        Test Login Credentials
      </h2>

      <div className="space-y-3">
        {demo && (
          <div className="bg-white border border-gray-200 p-3 rounded-md flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">{demo.description}</p>
              <p className="text-xs text-gray-600">Username: {demo.username}</p>
              <p className="text-xs text-gray-600">Password: {demo.password}</p>
            </div>
            {demo.url && (
              <button
                onClick={() => window.open(demo.url, "_blank")}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Open
              </button>
            )}
          </div>
        )}

        {admin && (
          <div className="bg-white border border-gray-200 p-3 rounded-md flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">{admin.description}</p>
              <p className="text-xs text-gray-600">Username: {admin.username}</p>
              <p className="text-xs text-gray-600">Password: {admin.password}</p>
            </div>
            {demoUrl && (
               <div className="flex items-center justify-center pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-500 border-green-500 hover:bg-green-50 hover:text-black"
                      onClick={onPreview}
                    >
                      <ExternalLink className="h-4 w-4 mr-1 text-green-500" />
                      Test Demo
                    </Button>
                  </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCredentialsNotice;
