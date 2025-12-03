import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  metadata?: string;
  packageName?: string;
  monthlyDownloads?: number;
  license?: string;
}

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  options: ComboboxOption[];
  isLoading?: boolean;
  error?: string | null;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Combobox = ({
  value,
  onChange,
  onSelect,
  options,
  isLoading = false,
  error = null,
  placeholder = "Search...",
  className,
  disabled = false,
}: ComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    // reset refs array when options change
    optionRefs.current = optionRefs.current.slice(0, options.length);
  }, [options.length]);

  useEffect(() => {
    if (selectedIndex >= 0 && isOpen) {
      const selectedElement = optionRefs.current[selectedIndex];
      selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      // focus the element for proper Tab navigation
      selectedElement?.focus();
    }
  }, [selectedIndex, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (options.length > 0 || isLoading) {
      setIsOpen(true);
    }
  };

  const handleSelect = (option: ComboboxOption) => {
    onSelect(option.value);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen && options.length > 0) {
          setIsOpen(true);
        }
        if (isOpen && options.length > 0) {
          setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen && options.length > 0) {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
      case "Home":
        e.preventDefault();
        if (isOpen && options.length > 0) {
          setSelectedIndex(0);
        }
        break;
      case "End":
        e.preventDefault();
        if (isOpen && options.length > 0) {
          setSelectedIndex(options.length - 1);
        }
        break;
      case "PageDown":
        e.preventDefault();
        if (isOpen && options.length > 0) {
          const pageSize = 5;
          setSelectedIndex((prev) => Math.min(prev + pageSize, options.length - 1));
        }
        break;
      case "PageUp":
        e.preventDefault();
        if (isOpen && options.length > 0) {
          const pageSize = 5;
          setSelectedIndex((prev) => Math.max(prev - pageSize, 0));
        }
        break;
      case "Tab":
        if (isOpen && options.length > 0) {
          if (e.shiftKey) {
            // Shift+Tab: move to previous option or close if at first
            if (selectedIndex > 0) {
              e.preventDefault();
              setSelectedIndex(selectedIndex - 1);
            } else if (selectedIndex === 0) {
              e.preventDefault();
              setIsOpen(false);
              setSelectedIndex(-1);
            }
            // if selectedIndex === -1, allow default behavior
          } else {
            // Tab: move to next option or close if at last
            if (selectedIndex < options.length - 1) {
              e.preventDefault();
              setSelectedIndex(selectedIndex + 1);
            } else if (selectedIndex === options.length - 1) {
              e.preventDefault();
              setIsOpen(false);
              setSelectedIndex(-1);
            } else if (selectedIndex === -1 && options.length > 0) {
              // start from first option
              e.preventDefault();
              setSelectedIndex(0);
            }
          }
        }
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < options.length) {
          handleSelect(options[selectedIndex]);
        } else if (options.length === 1) {
          handleSelect(options[0]);
        } else if (options.length > 0 && selectedIndex === -1) {
          // select first option if none selected
          handleSelect(options[0]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleSelect(options[index]);
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(index < options.length - 1 ? index + 1 : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(index > 0 ? index - 1 : options.length - 1);
        break;
      case "Home":
        e.preventDefault();
        setSelectedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setSelectedIndex(options.length - 1);
        break;
      case "PageDown":
        e.preventDefault();
        const pageSizeDown = 5;
        setSelectedIndex(Math.min(index + pageSizeDown, options.length - 1));
        break;
      case "PageUp":
        e.preventDefault();
        const pageSizeUp = 5;
        setSelectedIndex(Math.max(index - pageSizeUp, 0));
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
        break;
      case "Tab":
        // Tab navigation: move to next/previous option or close dropdown
        if (!e.shiftKey) {
          // Tab: move to next option or close if at last
          if (index < options.length - 1) {
            e.preventDefault();
            setSelectedIndex(index + 1);
          } else {
            // at last item, close and allow Tab to move to next element
            setIsOpen(false);
            setSelectedIndex(-1);
          }
        } else {
          // Shift+Tab: move to previous option or close if at first
          if (index > 0) {
            e.preventDefault();
            setSelectedIndex(index - 1);
          } else {
            // at first item, close and allow Shift+Tab to move to previous element
            setIsOpen(false);
            setSelectedIndex(-1);
          }
        }
        break;
    }
  };

  const showDropdown = isOpen && (options.length > 0 || isLoading || error);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-8"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ?
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          : <ChevronDown
              className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")}
            />
          }
        </div>
      </div>

      {showDropdown && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md",
            "max-h-[300px] overflow-auto",
          )}
        >
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Searching...
            </div>
          )}

          {error && <div className="p-4 text-sm text-destructive">{error}</div>}

          {!isLoading && !error && options.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">No packages found</div>
          )}

          {!isLoading && !error && options.length > 0 && (
            <div ref={listRef} className="p-1">
              {options.map((option, index) => (
                <div
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  tabIndex={selectedIndex === index ? 0 : -1}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={cn(
                    "relative flex cursor-pointer select-none flex-col gap-1 rounded-sm px-3 py-2.5 text-sm outline-none transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    selectedIndex === index && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onKeyDown={(e) => handleOptionKeyDown(e, index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground">{option.label}</div>
                      {option.description && (
                        <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {option.description}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
                      {option.metadata && (
                        <div className="font-medium text-foreground">v{option.metadata}</div>
                      )}
                      {option.monthlyDownloads !== undefined && (
                        <div>
                          {option.monthlyDownloads >= 1000000 ?
                            `${(option.monthlyDownloads / 1000000).toFixed(1)}M`
                          : option.monthlyDownloads >= 1000 ?
                            `${(option.monthlyDownloads / 1000).toFixed(1)}k`
                          : option.monthlyDownloads}
                          /mo
                        </div>
                      )}
                      {option.license && <div className="text-[10px]">{option.license}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
