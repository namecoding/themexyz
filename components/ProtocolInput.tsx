import * as React from "react"
import { ChevronDown } from "lucide-react"

type ProtocolInputProps = {
    protocolValue: string
    inputValue: string
    onProtocolChange: (value: string) => void
    onInputChange: (value: string) => void
    inputPlaceholder?: string
    id?: string
    disabled?: boolean
}

const ProtocolInput: React.FC<ProtocolInputProps> = ({
    protocolValue,
    inputValue,
    onProtocolChange,
    onInputChange,
    inputPlaceholder = "example.com",
    id,
    disabled = false
}) => {
    return (
        <div className="w-full">
            <div
                className={[
                    "relative flex w-full items-stretch rounded-md border border-gray-300 bg-white shadow-sm",
                    "focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500",
                    disabled ? "opacity-60 pointer-events-none" : ""
                ].join(" ")}
            >
                {/* Protocol select */}
                <div className="relative">
                    <select
                        aria-label="Protocol"
                        value={protocolValue || "https://"}
                        onChange={(e) => onProtocolChange(e.target.value)}
                        className={[
                            "h-11 sm:h-10 bg-transparent text-gray-900 text-sm",
                            "appearance-none outline-none border-0",
                            "pl-3 pr-9",
                            "min-w-[96px]"
                        ].join(" ")}
                        disabled={disabled}
                    >
                        <option value="https://">https://</option>
                        <option value="http://">http://</option>
                    </select>
                    <ChevronDown
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                        aria-hidden="true"
                    />
                </div>

                {/* Hairline divider with smaller spacing */}
                <div className="my-1 mx-0 w-px self-stretch bg-gray-200" />

                {/* Input with reduced left padding */}
                <input
                    id={id}
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder={inputPlaceholder}
                    className={[
                        "flex-1 h-11 sm:h-10 bg-transparent text-gray-900 text-sm placeholder-gray-500",
                        "outline-none border-0 focus:outline-none",
                        "pl-1 pr-3" // tightened padding
                    ].join(" ")}
                    inputMode="url"
                    autoComplete="off"
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

export default ProtocolInput
