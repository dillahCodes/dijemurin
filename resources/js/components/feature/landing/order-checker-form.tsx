import { useOrderChecker } from '@/hooks/feature/landing/use-order-checker';
import { OrderCheckerFormProps } from '@/types/feature/landing';
import { ArrowRight, Search } from 'lucide-react';

export function OrderCheckerForm({ className = '' }: OrderCheckerFormProps) {
    const { orderCode, setOrderCode, handleSubmit } = useOrderChecker();

    return (
        <form onSubmit={handleSubmit} className={`w-full ${className}`}>
            <div className="mx-auto flex max-w-xl items-center rounded-full border border-white/20 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
                <div className="flex flex-1 items-center gap-3 px-4 sm:px-6">
                    <Search className="h-5 w-5 shrink-0 text-zinc-400" />
                    <input
                        type="text"
                        name="order_code"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value)}
                        placeholder="Kode Pesanan (Cth: ORD-JD-2026)"
                        className="w-full border-none bg-transparent py-3 font-sans text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-0 dark:text-zinc-100"
                        required
                    />
                </div>
                <button
                    type="submit"
                    aria-label="Cari Status Pesanan"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>
        </form>
    );
}
