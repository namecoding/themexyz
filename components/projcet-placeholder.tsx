import React from "react";

const ProjectPlaceholder = ({i}) =>{
    return(
        <div className="divide-y divide-gray-200 space-y-4">
              {Array.from({ length: i }).map((_, index) => (
                <div key={index} className="p-4 animate-pulse">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="flex items-center flex-grow mb-4 sm:mb-0">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-16 h-12 bg-gray-200 rounded-md" />
                      </div>
                      <div className="flex-grow min-w-0 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-300 rounded" />
                        <div className="flex gap-4 mt-1">
                          <div className="h-3 w-40 bg-gray-200 rounded" />
                          <div className="h-3 w-40 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:ml-4 mt-2 sm:mt-0">
                      <div className="h-6 w-28 bg-gray-200 rounded" />
                      <div className="h-6 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                    <div className="h-3 w-64 bg-gray-200 rounded" />
                    <div className="flex flex-wrap gap-2">
                      <div className="h-8 w-20 bg-gray-200 rounded" />
                      <div className="h-8 w-24 bg-gray-200 rounded" />
                      <div className="h-8 w-20 bg-gray-200 rounded" />
                      <div className="h-8 w-28 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
    )
}

export default ProjectPlaceholder;