import { cn } from "@/lib/utils"

function SkeletonEffect({index}) {
  return (
      <div key={index} className="h-64 rounded-lg dark:bg-gray-800 animate-pulse">
        <div className="space-y-2 p-4 border rounded-md bg-white dark:bg-muted animate-pulse">
          <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md" />
          <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
  )
}

export { SkeletonEffect }
