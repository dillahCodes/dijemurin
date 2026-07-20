import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useFadeUp } from '@/hooks/animations';
import { useFaqAccordion } from '@/hooks/feature/landing/use-faq-accordion';
import { FAQItem } from '@/types/feature/landing';
import { ChevronDown } from 'lucide-react';

interface FAQCardProps {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
}

function FAQCard({ item, isOpen, onToggle }: FAQCardProps) {
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={onToggle}
            className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all dark:border-zinc-800 dark:bg-zinc-900/60"
        >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left font-sans text-base font-bold text-zinc-950 transition-colors hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800/50">
                <span>{item.question}</span>
                <ChevronDown
                    className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-zinc-950 dark:text-white' : ''
                    }`}
                />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t border-zinc-100 p-6 font-sans text-sm leading-relaxed text-zinc-600 sm:text-base dark:border-zinc-800/80 dark:text-zinc-400">
                <p>{item.answer}</p>
            </CollapsibleContent>
        </Collapsible>
    );
}

export function FAQSection() {
    const { faqs, openIndex, toggle } = useFaqAccordion(0);
    const { ref } = useFadeUp<HTMLDivElement>({ delay: 100 });

    return (
        <section className="px-4 py-16 sm:px-6 md:py-24" id="faq">
            <div className="mx-auto max-w-3xl space-y-12">
                <div className="space-y-4 text-center">
                    <h2 className="font-sans text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-white">
                        Pertanyaan Umum
                    </h2>
                    <p className="font-sans text-base text-zinc-600 dark:text-zinc-400">
                        Hal yang sering ditanyakan oleh mitra dan pengusaha laundry.
                    </p>
                </div>

                <div ref={ref} className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <FAQCard key={idx} item={faq} isOpen={openIndex === idx} onToggle={() => toggle(idx)} />
                    ))}
                </div>
            </div>
        </section>
    );
}
