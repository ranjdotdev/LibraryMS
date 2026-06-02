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
import { listBooks } from "../api"

type Props = {
  value: string
  onChange: (id: string) => void
  availableOnly?: boolean
}

export function BookPicker({ value, onChange, availableOnly }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debounced = useDebouncedValue(search, 300)

  const { data } = useQuery({
    queryKey: [
      "books",
      "list",
      { search: debounced || undefined, available: availableOnly || undefined, page: 1, pageSize: 20 },
    ],
    queryFn: () =>
      listBooks({
        search: debounced || undefined,
        available: availableOnly || undefined,
        page: 1,
        pageSize: 20,
      }),
  })
  const books = data?.items ?? []
  const selected = books.find((b) => b.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          <span className="truncate">{selected ? selected.title : "Pick a book"}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 opacity-50 ms-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search books…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No books found.</CommandEmpty>
            <CommandGroup>
              {books.map((b) => (
                <CommandItem
                  key={b.id}
                  value={b.id}
                  onSelect={() => {
                    onChange(b.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-col">
                    <span>{b.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {b.author} · {b.availableCopies}/{b.totalCopies} available
                    </span>
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
