"use client"

import * as React from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

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
  predefinedFeatures = [],
  value = [],
  onChange,
  label = "Features",
  placeholder = "Type to add or pick…",
  subtext = "Highlight the key features and capabilities of your product",
  errors,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const safeValue = value || []
  const safePredefinedFeatures = predefinedFeatures || []

  const normalized = (s: string) => s.trim().toLowerCase()
  const exists = (s: string) => safeValue.some((v) => normalized(v) === normalized(s))
  const inCatalog = (s: string) => safePredefinedFeatures.some((v) => normalized(v) === normalized(s))

  const filtered = React.useMemo(() => {
    const q = normalized(query)
    return q ? safePredefinedFeatures.filter((f) => normalized(f).includes(q)) : safePredefinedFeatures
  }, [safePredefinedFeatures, query])

  const add = (item: string) => {
    if (!item.trim()) return
    if (!exists(item)) onChange([...safeValue, item.trim()])
    setQuery("")
  }

  const remove = (idx: number) => {
    const next = [...safeValue]
    next.splice(idx, 1)
    onChange(next)
  }

  const canCreate = !!query.trim() && !inCatalog(query) && !exists(query)

  return (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      <p className="text-xs text-gray-500 mb-2">{subtext}</p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "relative w-full bg-white border border-gray-300 rounded-md px-2 text-sm text-gray-900",
              "focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 cursor-text",
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
                    if (query && !inCatalog(query) && !exists(query)) {
                      add(query)
                    }
                  }
                  if (e.key === "Escape") setOpen(false)
                }}
              />

              {!open && canCreate && (
                <button
                  type="button"
                  aria-label={`Add "${query.trim()}"`}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md border border-green-500 px-2 py-1 text-xs font-medium text-green-500 hover:bg-green-50"
                  onMouseDown={(e) => {
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

        <PopoverContent
          className="p-0 w-(--radix-popover-trigger-width)"
          sideOffset={6}
          collisionPadding={10}
          side="bottom"
          align="start"
          avoidCollisions={true}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <div className="border-b border-gray-200 p-2">
              <CommandInput
                value={query}
                onValueChange={setQuery}
                placeholder="Search features..."
                className="border-0 focus:ring-0 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (query && !inCatalog(query) && !exists(query)) {
                      add(query)
                    }
                  }
                  if (e.key === "Escape") setOpen(false)
                }}
              />
            </div>

            <CommandList
              className="max-h-40 overflow-y-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgb(156_163_175)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-500"
              onWheel={(e) => {
                e.stopPropagation()
              }}
              onTouchMove={(e) => {
                e.stopPropagation()
              }}
            >
              <CommandEmpty className="p-4 text-center text-sm text-gray-500">
                {query ? `No features found matching "${query}"` : "No features available"}
              </CommandEmpty>

              {canCreate && (
                <CommandGroup heading="Create New">
                  <CommandItem
                    value={`__create__:${query}`}
                    onSelect={() => add(query)}
                    className="flex items-center justify-between text-green-700"
                  >
                    <span>Create "{query.trim()}"</span>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-md border border-green-500 px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        add(query)
                      }}
                    >
                      <span>Add</span>
                      <Plus className="h-4 w-4" />
                    </button>
                  </CommandItem>
                </CommandGroup>
              )}

              <CommandGroup heading={`Suggestions ${query ? `(${filtered.length} found)` : `(${filtered.length})`}`}>
                {filtered.map((f) => {
                  const selected = exists(f)
                  return (
                    <CommandItem
                      key={f}
                      value={f}
                      onSelect={() => add(f)}
                      className={cn(selected && "bg-green-50 text-green-500")}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{f}</span>
                        {selected && <span className="text-green-600 text-xs">✓ Selected</span>}
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2 mt-2">
        {safeValue.map((feature, i) => (
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

      {!!errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
    </div>
  )
}
