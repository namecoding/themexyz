import * as React from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { subtle } from "crypto"

type Props = {
    predefinedFeatures: string[]
    value: string[]
    onChange: (next: string[]) => void
    label?: string
    subtext?: string
    placeholder?: string
    errors?: string
}

export function FeaturesCombobox({
    predefinedFeatures,
    value,
    onChange,
    label = "Features",
    placeholder = "Type to add or pick…",
    subtext = "Highlight the key features and capabilities of your product",
    errors
}: Props) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")

    const normalized = (s: string) => s.trim().toLowerCase()
    const exists = (s: string) => value.some(v => normalized(v) === normalized(s))
    const inCatalog = (s: string) => predefinedFeatures.some(v => normalized(v) === normalized(s))

    const filtered = React.useMemo(() => {
        const q = normalized(query)
        return q
            ? predefinedFeatures.filter(f => normalized(f).includes(q))
            : predefinedFeatures
    }, [predefinedFeatures, query])

    const add = (item: string) => {
        if (!item.trim()) return
        if (!exists(item)) onChange([...value, item.trim()])
        setQuery("")
    }

    const remove = (idx: number) => {
        const next = [...value]
        next.splice(idx, 1)
        onChange(next)
    }

    const canCreate =
        !!query.trim() && !inCatalog(query) && !exists(query)

    return (
        <div>
            <label className="text-sm text-gray-700">{label}</label>
            <p className="text-xs text-gray-500 mb-2">
                {subtext}
            </p>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {/* This looks like an input and supports typing */}
                    <div
                        className={cn(
                            "relative w-full bg-white border border-gray-300 rounded-md px-2 text-sm text-gray-900",
                            "focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 cursor-text"
                        )}
                        onClick={() => setOpen(true)}
                    >
                        <Command className="overflow-visible">
                            <CommandInput
                                value={query}
                                onValueChange={setQuery}
                                placeholder={placeholder}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        // Create on Enter if it’s new
                                        if (query && !inCatalog(query) && !exists(query)) {
                                            add(query)
                                        }
                                    }
                                    if (e.key === "Escape") setOpen(false)
                                }}
                            />

                            {/* Inline + add button when typing AND dropdown is closed */}
                            {!open && canCreate && (
                                <button
                                    type="button"
                                    aria-label={`Add "${query.trim()}"`}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md border border-green-500 px-2 py-1 text-xs font-medium text-green-500 hover:bg-green-50"
                                    onMouseDown={(e) => {
                                        // keep focus in input, don't collapse caret
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        add(query)
                                    }}
                                >
                                    <span className="hidden sm:inline">Add</span>
                                    <Plus className="h-4 w-4" />
                                </button>
                            )}

                        </Command>
                    </div>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
                    <Command>
                        <CommandInput
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Search features…"
                            autoFocus
                        />
                        <CommandList className="max-h-56">
                            <CommandEmpty className="p-2 text-sm text-gray-500">
                                No matches
                            </CommandEmpty>


                            {/* Creatable row in dropdown */}
                            {canCreate && (
                                <CommandGroup heading="Actions">
                                    <CommandItem
                                        value={`__create__:${query}`}
                                        onSelect={() => add(query)}
                                        className="flex items-center justify-between text-green-700"
                                    >
                                        <span>Typing... “{query.trim()}”</span>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 rounded-md border border-green-500 px-2 py-1 text-xs font-medium text-green-500 hover:bg-green-50"
                                        >
                                            <span>Add</span>
                                            <Plus className="h-4 w-4 text-green-500" />
                                        </button>

                                    </CommandItem>
                                </CommandGroup>
                            )}


                            <CommandGroup heading="Suggestions">
                                {filtered.map((f) => {
                                    const selected = exists(f)
                                    return (
                                        <CommandItem
                                            key={f}
                                            value={f}
                                            onSelect={() => add(f)}
                                            className={cn(selected && "bg-green-100 text-green-800")}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span>{f}</span>
                                                {selected && (
                                                    <span className="text-green-600 text-xs">✓ Selected</span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>


                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Selected chips */}
            <div className="flex flex-wrap gap-2 mt-2">
                {value.map((feature, i) => (
                    <Badge key={`${feature}-${i}`} variant="secondary" className="bg-green-50 text-green-500">
                        {feature}
                        <X
                            className="h-3 w-3 ml-1 cursor-pointer text-red-500"
                            onClick={() => remove(i)}
                            aria-label={`Remove ${feature}`}
                        />
                    </Badge>
                ))}
            </div>

            {!!errors && (
                <p className="text-red-500 text-xs mt-1">{errors}</p>
            )}
        </div>
    )
}
