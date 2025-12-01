"use client"

import * as React from "react"
import { UploadCloud } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

type DropzoneContextValue = {
  isDragging: boolean
  openFileDialog: () => void
  disabled: boolean
}

const DropzoneContext = React.createContext<DropzoneContextValue | null>(null)

function useDropzoneContext(component: string) {
  const context = React.useContext(DropzoneContext)

  if (!context) {
    throw new Error(`${component} must be used within a Dropzone`)
  }

  return context
}

type Accept = string | string[] | Record<string, string[]> | undefined

type NormalizedAccept =
  | {
      inputValue: string
      items: string[]
    }
  | undefined

type DropzoneProps = React.ComponentProps<"div"> & {
  onFiles?: (files: File[]) => void
  accept?: Accept
  multiple?: boolean
  disabled?: boolean
  maxSize?: number
  maxFiles?: number
  onError?: (message: string) => void
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      className,
      children,
      onFiles,
      accept,
      multiple = true,
      disabled = false,
      maxSize,
      maxFiles,
      onError,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = React.useState(false)

    const normalizedAcceptList = React.useMemo(
      () => normalizeAccept(accept),
      [accept]
    )

    const resolvedMultiple =
      typeof maxFiles === "number" ? maxFiles > 1 : multiple

    const handleFiles = (files: FileList | null) => {
      if (!files?.length) return
      const selected = Array.from(files)
      const filteredByAccept = selected.filter((file) => {
        if (!normalizedAcceptList) return true
        return fileMatchesAccept(file, normalizedAcceptList)
      })
      const acceptedFiles = filteredByAccept.filter((file) => {
        if (maxSize && file.size > maxSize) {
          onError?.(
            `"${file.name}" exceeds the ${(maxSize / 1024 / 1024).toFixed(
              1
            )}MB limit`
          )
          return false
        }
        return true
      })

      if (!acceptedFiles.length) return

      const limitedFiles =
        typeof maxFiles === "number"
          ? acceptedFiles.slice(0, maxFiles)
          : acceptedFiles

      if (
        typeof maxFiles === "number" &&
        acceptedFiles.length > maxFiles &&
        onError
      ) {
        onError(`Only ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`)
      }

      onFiles?.(limitedFiles)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files)
      event.target.value = ""
    }

    const openFileDialog = () => {
      if (disabled) return
      inputRef.current?.click()
    }

    return (
      <DropzoneContext.Provider
        value={{ isDragging, openFileDialog, disabled }}
      >
        <div
          ref={ref}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          data-slot="dropzone"
          data-dragging={isDragging ? "true" : undefined}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm transition-[border-color,background-color,box-shadow] hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragging && "border-primary bg-primary/5",
            disabled && "pointer-events-none opacity-60",
            className
          )}
          onClick={(event) => {
            if (event.defaultPrevented) return

            if ((event.target as HTMLElement).closest("button,a,input,label")) {
              return
            }

            openFileDialog()
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              openFileDialog()
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault()
            if (disabled) return
            setIsDragging(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            if (disabled) return
            setIsDragging(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            if (disabled) return
            setIsDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            if (disabled) return
            setIsDragging(false)
            handleFiles(event.dataTransfer?.files ?? null)
          }}
          {...props}
        >
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            onChange={handleInputChange}
            accept={normalizedAcceptList?.inputValue}
            multiple={resolvedMultiple}
            disabled={disabled}
          />
          {children}
        </div>
      </DropzoneContext.Provider>
    )
  }
)
Dropzone.displayName = "Dropzone"

function DropzoneContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isDragging } = useDropzoneContext("DropzoneContent")

  return (
    <div
      data-slot="dropzone-content"
      data-dragging={isDragging ? "true" : undefined}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 px-4 py-10 text-center text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

type DropzoneEmptyStateProps = React.ComponentProps<"div"> & {
  icon?: React.ReactNode
  title?: string
  description?: string
}

function DropzoneEmptyState({
  className,
  icon = <UploadCloud className="size-8" strokeWidth={1.5} />,
  title = "Drop files to upload",
  description = "Or click to browse from your device",
  children,
  ...props
}: DropzoneEmptyStateProps) {
  return (
    <div
      data-slot="dropzone-empty-state"
      className={cn(
        "flex flex-col items-center gap-2 text-sm text-foreground",
        className
      )}
      {...props}
    >
      <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full border border-dashed">
        {icon}
      </div>
      <div className="flex flex-col gap-1 text-center">
        <p className="text-base font-medium">{title}</p>
        <p className="text-muted-foreground text-xs md:text-sm">
          {description}
        </p>
      </div>
      {children ? <div className="mt-2 flex gap-2">{children}</div> : null}
    </div>
  )
}

function normalizeAccept(accept: Accept): NormalizedAccept {
  if (!accept) return undefined

  if (typeof accept === "string") {
    const items = accept.split(",").map((item) => item.trim())
    return { inputValue: accept, items }
  }

  if (Array.isArray(accept)) {
    const inputValue = accept.join(",")
    return { inputValue, items: accept.map((item) => item.trim()) }
  }

  const entries = Object.entries(accept)
  const flat = entries.flatMap(([mime, extensions]) => [mime, ...extensions])
  const inputValue = flat.join(",")
  return { inputValue, items: flat.map((item) => item.trim()) }
}

function fileMatchesAccept(file: File, normalizedAccept: NormalizedAccept) {
  if (!normalizedAccept) return true

  const { items } = normalizedAccept
  const fileName = file.name.toLowerCase()
  const mime = file.type.toLowerCase()

  return items.some((rule) => {
    if (!rule) return false
    const value = rule.toLowerCase()

    if (value.endsWith("/*")) {
      const prefix = value.replace("/*", "")
      return mime.startsWith(prefix)
    }

    if (value.startsWith(".")) {
      return fileName.endsWith(value)
    }

    return mime === value
  })
}

export { Dropzone, DropzoneContent, DropzoneEmptyState }
