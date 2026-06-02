import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core/select"

type Role = "Admin" | "Member"

type Props = {
  value: Role | ""
  onChange: (role: Role) => void
  placeholder?: string
}

export function RolePicker({ value, onChange, placeholder = "Pick a role" }: Props) {
  return (
    <Select value={value || undefined} onValueChange={(v) => onChange(v as Role)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Member">Member</SelectItem>
        <SelectItem value="Admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}
