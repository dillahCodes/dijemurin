import { cn } from '@/lib/utils';
import { Check, ChevronDown, X } from 'lucide-react';
import { Activity, ChangeEvent, ComponentProps, KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react';
import { Badge } from './badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from './dropdown-menu';
import { InputGroup, InputGroupButton, InputGroupInput } from './input-group';

// 1. Local Types
export interface MultipleOption {
    label: string;
    value: string;
}

export interface MultiSelectListBoxProps {
    options: MultipleOption[];
    selected: MultipleOption[];
    onChange: (selected: MultipleOption[]) => void;
    onInputChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    inputProps?: ComponentProps<typeof InputGroupInput>;
}

interface SelectedBadgeProps {
    item: MultipleOption;
    onRemove: () => void;
}

interface SelectDropdownMenuProps {
    options: MultipleOption[];
    selected: MultipleOption[];
    onSelectOption: (option: MultipleOption) => void;
    containerRef: RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

// 2. Sub-components
function SelectedBadge({ item, onRemove }: SelectedBadgeProps) {
    return (
        <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-sm [&>svg]:pointer-events-auto">
            <span>{item.label}</span>
            <X className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={onRemove} />
        </Badge>
    );
}

function SelectDropdownMenu({
    options,
    selected,
    onSelectOption,
    containerRef,
    isOpen,
    setIsOpen,
}: SelectDropdownMenuProps) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            setWidth(entries[0].borderBoxSize[0].inlineSize);
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [containerRef]);

    return (
        <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                    <InputGroupButton
                        variant="ghost"
                        className="h-7 w-7 border-none p-0 text-muted-foreground hover:text-foreground"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="z-50 mt-2 [--radius:0.95rem]"
                    style={{ width: width > 0 ? `${width}px` : undefined }}
                    // @ts-expect-error onOpenAutoFocus works conceptually here to prevent focus stealing
                    onOpenAutoFocus={(e: Event) => e.preventDefault()}
                >
                    <Activity mode={options.length ? 'visible' : 'hidden'}>
                        <DropdownMenuGroup>
                            {options.map((option) => {
                                const isSelected = selected.some((opt) => opt.value === option.value);
                                return (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            onSelectOption(option);
                                        }}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && <Check className="h-4 w-4" />}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuGroup>
                    </Activity>

                    <Activity mode={options.length ? 'hidden' : 'visible'}>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <DropdownMenuLabel>Tidak ada data</DropdownMenuLabel>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </Activity>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

// 3. Main Component
export function MultiSelectListBox({
    options,
    selected,
    onChange,
    placeholder,
    className,
    inputProps,
    onInputChange,
}: MultiSelectListBoxProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsOpen(true);
        onInputChange?.(e.target.value);
    };

    const handleSelectOption = (option: MultipleOption) => {
        const exists = selected.some((opt) => opt.value === option.value);
        if (exists) {
            onChange(selected.filter((opt) => opt.value !== option.value));
        } else {
            onChange([...selected, option]);
        }
        setInputValue('');
        setIsOpen(false);
        onInputChange?.('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();

            const text = inputValue.trim();
            const match = options.find((opt) => opt.label === text || opt.value === text);

            if (match) {
                handleSelectOption(match);
            }
        }
    };

    const handleRemove = (index: number) => () => {
        onChange(selected.filter((_, i) => i !== index));
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <InputGroup className={cn('relative flex h-auto min-h-10 flex-wrap items-center gap-1.5 p-1.5 pr-8', className)}>
                {selected.map((item, index) => (
                    <SelectedBadge key={index} item={item} onRemove={handleRemove(index)} />
                ))}

                <InputGroupInput
                    placeholder={!selected.length ? (placeholder ?? 'Placeholder...') : ''}
                    className="h-7 min-w-[120px] flex-1 border-0 bg-transparent px-1 py-1 shadow-none focus-visible:ring-0"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    {...inputProps}
                />

                <SelectDropdownMenu
                    options={options}
                    selected={selected}
                    onSelectOption={handleSelectOption}
                    containerRef={containerRef}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            </InputGroup>
        </div>
    );
}
