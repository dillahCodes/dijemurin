import { router, usePage } from '@inertiajs/react';
import { Plus, Store, X } from 'lucide-react';
import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { useModal } from '@/components/ui/modal';
import { useCart } from '@/context/feature/cart/cart-context';
import { RoleHelper } from '@/helper/role-helper';
import { useServiceSearch } from '@/hooks/feature/layanan/use-service-search';
import { UserRole } from '@/types/feature/user/user';
import type { ServicePageProps } from './service-section';
import layanan from '@/routes/layanan';

// 1. Sub-components
function ServiceOutletDisplay() {
    const modal = useModal();
    const { dispatch } = useCart();
    const { outletSelected } = usePage<ServicePageProps>().props;
    const outletName = outletSelected?.data?.name;

    const handleChangeOutlet = () => {
        modal.open({
            id: 'outlet-change-modal',
            title: 'Ganti Outlet',
            description: 'Apakah anda yakin ingin mengganti outlet?, daftar barang di keranjang akan dihapus',
            onConfirm: () => {
                dispatch({ type: 'CLEAR' });
                router.get(layanan.index().url);
            },
            confirmContent: 'Ya, Ganti',
            cancelContent: 'Tidak, Batalkan',
        });
    };

    if (!outletName) {
        return null;
    }

    return (
        <div className="w-full sm:w-[250px] lg:w-[280px]">
            <InputGroup>
                <InputGroupAddon align="inline-start">
                    <InputGroupText>
                        <Store size={14} />
                    </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput disabled readOnly value={outletName} className="cursor-not-allowed opacity-70" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        size="xs"
                        onClick={handleChangeOutlet}
                        className="cursor-pointer text-xs text-primary hover:text-primary"
                    >
                        Ganti
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}

interface ServiceSearchActionsProps {
    search: string;
    shouldDisableSearch: boolean;
    onClear: () => void;
}

function ServiceSearchActions({ search, shouldDisableSearch, onClear }: ServiceSearchActionsProps) {
    return (
        <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
            <Activity mode={search ? 'visible' : 'hidden'}>
                <Button variant="ghost" type="button" onClick={onClear} className="cursor-pointer px-3">
                    <X size={16} />
                </Button>
            </Activity>

            <Button type="submit" disabled={shouldDisableSearch} className="w-full cursor-pointer sm:w-auto">
                Cari
            </Button>
        </div>
    );
}

function ServiceAddButton() {
    const handleGoToAddForm = () => {
        router.get(layanan.create().url);
    };

    return (
        <Button onClick={handleGoToAddForm} className="w-full cursor-pointer sm:w-auto">
            <Plus size={16} className="mr-2" />
            Tambah Layanan
        </Button>
    );
}

// 2. Main Component
export function ServiceSearch() {
    const { handlers, data } = useServiceSearch();
    const { auth } = usePage<ServicePageProps>().props;
    const hasSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    return (
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={handlers.handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                <div className="w-full sm:w-[250px] lg:w-[280px]">
                    <Input
                        type="text"
                        placeholder="Cari layanan..."
                        name="search"
                        value={data.search}
                        onChange={handlers.handleSearchChange}
                        className="w-full"
                    />
                </div>

                <Activity mode={hasSuperAdmin ? 'visible' : 'hidden'}>
                    <ServiceOutletDisplay />
                </Activity>

                <ServiceSearchActions
                    search={data.search}
                    shouldDisableSearch={data.shouldDisableSearch}
                    onClear={handlers.handleClear}
                />
            </form>

            <Activity mode={hasSuperAdmin ? 'visible' : 'hidden'}>
                <div className="w-full shrink-0 sm:w-auto">
                    <ServiceAddButton />
                </div>
            </Activity>
        </div>
    );
}
