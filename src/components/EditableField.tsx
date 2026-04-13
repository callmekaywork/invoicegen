"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}

export function EditableField({
  value,
  onChange,
  label,
  className,
  type = "text",
  multiline = false,
  placeholder = "Click to edit",
  style,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <span className="text-[10px] uppercase font-mono opacity-40">
            {label}
          </span>
        )}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className={cn(
              "w-full p-1 border border-black bg-white focus:outline-none resize-none min-h-15",
              className,
            )}
            style={style}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className={cn(
              "h-auto p-1 border border-black bg-white focus:ring-0",
              className,
            )}
            style={style}
          />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "group relative cursor-pointer hover:bg-zinc-50 transition-colors p-1 -m-1 border border-transparent hover:border-zinc-200",
        !value && "min-h-[1.5em] min-w-25 bg-zinc-50/50",
        className,
      )}
      style={style}
    >
      {label && (
        <span className="text-[10px] uppercase font-mono opacity-40 block mb-1">
          {label}
        </span>
      )}
      <div
        className={cn(value ? "text-inherit" : "text-zinc-300 italic text-sm")}
      >
        {value || placeholder}
      </div>
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[8px] px-1 uppercase font-mono">
        Edit
      </div>
    </div>
  );
}
