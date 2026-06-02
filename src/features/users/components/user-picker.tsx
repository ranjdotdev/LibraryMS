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
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { useDebouncedValue } from "@/hooks/use-debounce"
import { listUsers } from "../api"

type Props = {
  value: string
  onChange: (id: string) => void
}

export function UserPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debounced = useDebouncedValue(search, 300)

  const { data } = useQuery({
    queryKey: ["users", "list", { search: debounced || undefined, page: 1, pageSize: 20 }],
    queryFn: () =>
      listUsers({ search: debounced || undefined, page: 1, pageSize: 20 }),
  })
  const users = data?.items ?? []
  const selected = users.find((u) => u.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          <span className="truncate">{selected ? selected.fullName : "Pick a user"}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 opacity-50 ms-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search users…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((u) => (
                <CommandItem
                  key={u.id}
                  value={u.id}
                  onSelect={() => {
                    onChange(u.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-col">
                    <span>{u.fullName}</span>
                    <span className="text-xs text-muted-foreground">{u.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
