"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { Button } from "./button";

/* =======================
   TYPES
======================= */

type ModalOptions = {
  id: string | number;
  title?: string;
  description?: string;
  content?: ReactNode;
  withConfirmButton?: boolean;
  confirmContent?: ReactNode;
  onConfirm?: () => void | Promise<void>;
  withCancelButton?: boolean;
  cancelContent?: ReactNode;
  onCancel?: () => void;
  wrapperClassName?: string;
};

type ModalState = ModalOptions & {
  isClosing: boolean;
};

interface ModalController {
  open: (options: ModalOptions) => void;
  close: (id: string | number) => void;
  closeAll: () => void;
}

/* =======================
   CONTEXT
======================= */

const ModalContext = createContext<ModalController | null>(null);

export function useModal(): ModalController {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
}

/* =======================
   DEFAULT OPTIONS
======================= */

const DEFAULT_MODAL_OPTIONS: Partial<ModalOptions> = {
  withCancelButton: true,
  withConfirmButton: true,
  confirmContent: "Confirm",
  cancelContent: "Cancel",
};

/* =======================
   PROVIDER
======================= */

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalStack, setModalStack] = useState<ModalState[]>([]);

  const open = useCallback((options: ModalOptions) => {
    setModalStack((currentStack) => {
      const stackWithoutSameId = currentStack.filter(
        (modalItem) => modalItem.id !== options.id
      );

      return [
        ...stackWithoutSameId,
        {
          ...DEFAULT_MODAL_OPTIONS,
          ...options,
          isClosing: false,
        },
      ];
    });

    document.body.classList.add("overflow-hidden");
  }, []);

  const close = useCallback((id: string | number) => {
    setModalStack((currentStack) =>
      currentStack.map((modalItem) =>
        modalItem.id === id
          ? { ...modalItem, isClosing: true }
          : modalItem
      )
    );
  }, []);

  const closeAll = useCallback(() => {
    setModalStack((currentStack) =>
      currentStack.map((modalItem) => ({
        ...modalItem,
        isClosing: true,
      }))
    );
  }, []);

  const removeModalFromStack = useCallback((id: string | number) => {
    setModalStack((currentStack) => {
      const remainingModals = currentStack.filter(
        (modalItem) => modalItem.id !== id
      );

      if (remainingModals.length === 0) {
        document.body.classList.remove("overflow-hidden");
      }

      return remainingModals;
    });
  }, []);

  return (
    <ModalContext.Provider value={{ open, close, closeAll }}>
      {children}

      {modalStack.map((modalItem, index) => (
        <ModalInstance
          key={modalItem.id}
          modalItem={modalItem}
          closeModal={close}
          removeModal={removeModalFromStack}
          zIndex={1000 + index}
        />
      ))}
    </ModalContext.Provider>
  );
}

/* =======================
   MODAL INSTANCE
======================= */

interface ModalInstanceProps {
  modalItem: ModalState;
  closeModal: (id: string | number) => void;
  removeModal: (id: string | number) => void;
  zIndex: number;
}

function ModalInstance({
  modalItem,
  closeModal,
  removeModal,
  zIndex,
}: ModalInstanceProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!modalItem.isClosing) {
      const animationFrame = requestAnimationFrame(() =>
        setIsVisible(true)
      );
      return () => cancelAnimationFrame(animationFrame);
    }

    setIsVisible(false);

    const timeout = setTimeout(() => {
      modalItem.onCancel?.();
      removeModal(modalItem.id);
    }, 100);

    return () => clearTimeout(timeout);
  }, [modalItem, removeModal]);

  const handleConfirmClick = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      await modalItem.onConfirm?.();
      closeModal(modalItem.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelClick = () => {
    if (isProcessing) return;

    modalItem.onCancel?.();
    closeModal(modalItem.id);
  };

  return (
    <section
      style={{ zIndex }}
      className={`fixed inset-0 flex items-center justify-center transition ${
        isVisible ? "bg-black/50" : "bg-black/0 pointer-events-none"
      }`}
      onClick={handleCancelClick}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-md m-3 rounded-xl bg-white p-6 dark:bg-black ${
          modalItem.wrapperClassName ?? ""
        }`}
      >
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{modalItem.title}</h2>
          <p className="text-sm">{modalItem.description}</p>
        </div>

        {/* Content */}
        <div>{modalItem.content}</div>

        {/* Footer */}
        {(modalItem.withCancelButton || modalItem.withConfirmButton) && (
          <div className="mt-6 flex gap-2">
            {modalItem.withCancelButton && (
              <Button
                variant="outline"
                onClick={handleCancelClick}
                disabled={isProcessing}
                className="flex-1"
              >
                {modalItem.cancelContent}
              </Button>
            )}

            {modalItem.withConfirmButton && (
              <Button
                onClick={handleConfirmClick}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Processing..." : modalItem.confirmContent}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}