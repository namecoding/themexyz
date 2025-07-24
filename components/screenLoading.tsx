import React from "react";
import {metaData} from "@/lib/utils";

const ScreenLoading = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#82b440]"></div>
            <span className="absolute z-20 text-xs">{metaData.name}...</span>
        </div>
    )
}

export default ScreenLoading;
