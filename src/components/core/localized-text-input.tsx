import { useFormContext, Controller } from "react-hook-form"
import type { FieldError } from "react-hook-form"
import { Textarea } from "@/components/core/textarea"
import { Label } from "@/components/core/label"
import { languages } from "@/lib/i18n"

type LocalizedTextInputProps = {
  name: string
  label: string
  required?: boolean
  placeholder?: Record<string, string>
  rows?: number
  description?: string
}

export function LocalizedTextInput({
  name,
  label,
  required = false,
  placeholder = {},
  rows = 4,
  description,
}: LocalizedTextInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const getError = (langCode: string): FieldError | undefined => {
    const nameKeys = name.split(".")
    let node: unknown = errors
    for (const key of nameKeys) {
      if (typeof node !== "object" || node === null) return undefined
      node = (node as Record<string, unknown>)[key]
    }
    if (typeof node !== "object" || node === null) return undefined
    const langError = (node as Record<string, unknown>)[langCode]
    if (typeof langError !== "object" || langError === null) return undefined
    return langError as FieldError
  }

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ms-1">*</span>}
      </Label>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div className="space-y-4">
        {languages.map((lang) => (
          <Controller
            key={lang.code}
            name={`${name}.${lang.code}`}
            control={control}
            rules={{
              required:
                required && lang.code === "en"
                  ? `${label} in English is required`
                  : false,
            }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label htmlFor={`${name}.${lang.code}`} className="text-sm font-medium">
                  {lang.nativeName}
                </Label>
                <Textarea
                  {...field}
                  id={`${name}.${lang.code}`}
                  value={field.value || ""}
                  placeholder={
                    placeholder[lang.code] ||
                    `Enter ${label.toLowerCase()} in ${lang.name}...`
                  }
                  rows={rows}
                  dir={lang.dir}
                  className="w-full"
                />
                {getError(lang.code) && (
                  <p className="text-sm text-destructive">
                    {getError(lang.code)?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {required
          ? "English is required. Other languages are optional."
          : "All languages are optional."}
      </p>
    </div>
  )
}
