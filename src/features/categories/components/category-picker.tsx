import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/core/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/core/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/core/command"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { listCategories } from "../api"

type Props = {
  value: string
  onChange: (id: string) => void
  placeholder?: string
  allowClear?: boolean
}

export function CategoryPicker({
  value,
  onChange,
  placeholder = "Pick a category",
  allowClear,
}: Props) {
  const [open, setOpen] = useState(false)
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "list"],
    queryFn: listCategories,
  })

  const selected = categories.find((c) => c.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          <span className="truncate">{selected ? selected.name : placeholder}</span>
          <div className="flex items-center gap-1 ms-2">
            {allowClear && value && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange("")
                }}
                className="opacity-60 hover:opacity-100"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              </span>
            )}
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories…" />
          <CommandList>
            <CommandEmpty>No categories.</CommandEmpty>
            <CommandGroup>
              {categories.map((c) => (
                <CommandItem
                  key={c.id}
                  value={c.name}
                  onSelect={() => {
                    onChange(c.id)
                    setOpen(false)
                  }}
                >
                  {c.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
