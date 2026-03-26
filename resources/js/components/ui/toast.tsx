import * as React from "react";
import { useState, useEffect, Activity } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, XCircle } from "lucide-react";

// ============================================================================
// 1. Types & Core Constants
// ============================================================================

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

export type ToastActionElement = {
    label: string;
    onClick: () => void;
};

export type ToastProps = {
    id: string;
    title?: string;
    description?: string;
    action?: ToastActionElement;
    open?: boolean;
    variant?: "default" | "success" | "error";
};

export interface ToastComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    title?: string;
    description?: string;
    action?: ToastActionElement;
    open?: boolean;
    variant?: "default" | "success" | "error";
    onOpenChange?: (open: boolean) => void;
}

// ============================================================================
// 2. State Management (Pub/Sub & Hooks)
// ============================================================================

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}

type ActionType =
    | { type: "ADD_TOAST"; toast: ToastProps }
    | { type: "UPDATE_TOAST"; toast: Partial<ToastProps> & { id: string } }
    | { type: "DISMISS_TOAST"; toastId?: string }
    | { type: "REMOVE_TOAST"; toastId?: string };

interface State {
    toasts: ToastProps[];
}

let memoryState: State = { toasts: [] };
let listeners: Array<(state: State) => void> = [];

function dispatch(action: ActionType) {
    switch (action.type) {
        case "ADD_TOAST":
            memoryState = {
                ...memoryState,
                toasts: [action.toast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
            };
            break;
        case "UPDATE_TOAST":
            memoryState = {
                ...memoryState,
                toasts: memoryState.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };
            break;
        case "DISMISS_TOAST":
            if (action.toastId) {
                memoryState = {
                    ...memoryState,
                    toasts: memoryState.toasts.map((t) =>
                        t.id === action.toastId ? { ...t, open: false } : t
                    ),
                };
            } else {
                memoryState = {
                    ...memoryState,
                    toasts: memoryState.toasts.map((t) => ({ ...t, open: false })),
                };
            }
            break;
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                memoryState = { ...memoryState, toasts: [] };
            } else {
                memoryState = {
                    ...memoryState,
                    toasts: memoryState.toasts.filter((t) => t.id !== action.toastId),
                };
            }
            break;
    }
    listeners.forEach((listener) => listener(memoryState));
}

function dismissToast(toastId: string) {
    dispatch({ type: "DISMISS_TOAST", toastId });
    setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId });
    }, 300);
}

export function toast(title: string, props?: Omit<ToastProps, "id" | "title" | "open">) {
    const id = genId();

    const newToast: ToastProps = {
        ...props,
        id,
        title,
        open: true,
    };

    dispatch({ type: "ADD_TOAST", toast: newToast });

    const timeout = setTimeout(() => {
        dismissToast(id);
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(id, timeout);

    return {
        id,
        dismiss: () => {
            const timeoutId = toastTimeouts.get(id);
            if (timeoutId) {
                clearTimeout(timeoutId);
                toastTimeouts.delete(id);
            }
            dismissToast(id);
        },
    };
}

export function useToast() {
    const [state, setState] = useState<State>(memoryState);

    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);

    return {
        ...state,
        toast,
        dismiss: dismissToast,
    };
}

// ============================================================================
// 3. Sub-components (UI Atoms)
// ============================================================================

function ToastClose({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
        >
            <X className="h-4 w-4" />
        </button>
    );
}

function ToastTitle({ children }: { children: React.ReactNode }) {
    return <div className="text-sm pb-1 font-semibold">{children}</div>;
}

function ToastDescription({ children }: { children: React.ReactNode }) {
    return <div className="text-sm opacity-90">{children}</div>;
}

function ToastActionRender({ action }: { action?: ToastActionElement }) {
    if (!action) return null;
    return (
        <button
            onClick={action.onClick}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-50"
        >
            {action.label}
        </button>
    );
}

function ToastItem({
    id,
    title,
    description,
    action,
    open = true,
    variant = "default",
    onOpenChange,
    className,
    ...props
}: ToastComponentProps) {
    return (
        <div
            className={cn(
                "group pointer-events-auto relative z-10 flex w-full items-start justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all duration-300",
                open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full sm:translate-x-full",
                variant === "default" && "bg-background text-foreground",
                variant === "success" && "bg-green-50/50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
                variant === "error" && "bg-red-50/50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
                className
            )}
            {...props}
        >
            <div className="flex gap-3 w-full">
                <Activity mode={variant !== "default" ? "visible" : "hidden"}>
                    <div className="mt-0.5 shrink-0">
                        {variant === "success" && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                        {variant === "error" && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                    </div>
                </Activity>
                <div className="flex flex-col gap-1 w-full">
                    <Activity mode={title ? "visible" : "hidden"}>
                        <ToastTitle>{title}</ToastTitle>
                    </Activity>
                    <Activity mode={description ? "visible" : "hidden"}>
                        <ToastDescription>{description}</ToastDescription>
                    </Activity>
                </div>
            </div>
            
            <Activity mode={action ? "visible" : "hidden"}>
                <ToastActionRender action={action} />
            </Activity>

            <ToastClose onClick={() => onOpenChange?.(false)} />
        </div>
    );
}

// ============================================================================
// 4. Main Component (Container)
// ============================================================================

export function Toaster() {
    const { toasts, dismiss } = useToast();

    return (
        <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-100 flex flex-col gap-2 w-full max-w-[420px] p-4"
        >
            {toasts.map((toastProps) => (
                <ToastItem
                    key={toastProps.id}
                    {...toastProps}
                    onOpenChange={(open) => {
                        if (!open) dismiss(toastProps.id);
                    }}
                />
            ))}
        </div>
    );
}
