import type { Order, OrderStatusEnglish, OrderStatusIndonesian } from '../order/order';
import type { Outlet } from '../outlet/outlet';
import type { User, UserRole } from '../user/user';

export type AccidentTransitionRules = Record<UserRole, Record<AccidentStatusEnglish, AccidentStatusEnglish[]>>;

export interface AccidentItem {
    id: number;
    accident_id: number;
    order_item_id: number;
    order_item_name: string | null;
    type: { label: AccidentTypeIndonesian; value: AccidentTypeEnglish };
    item_details: string | null;
    description: string;
    compensation_type: { label: AccidentCompensationTypeIndonesian; value: AccidentCompensationTypeEnglish } | null;
    compensation_amount: number | null;
    created_at: string;
    updated_at: string;
}

export interface Accident {
    id: number;
    outlet_id: number;
    outlet_name: string;
    order_id: number | null;
    order_code: string | null;
    customer_name: string | null;
    reporter_id: number;
    reporter_name: string;
    resolver_id: number | null;
    resolver_name: string | null;
    description: string | null;
    status: { label: AccidentStatusIndonesian; value: AccidentStatusEnglish };
    items?: AccidentItem[];
    items_count?: number;
    total_compensation_amount?: number;
    resolved_at: string | null;
    created_at: string;
    updated_at: string;
}

export enum AccidentTypeEnglish {
    LOST_ITEM = 'lost_item',
    DAMAGED_ITEM = 'damaged_item',
    COLOR_BLED = 'color_bled',
    SHRUNK_ITEM = 'shrunk_item',
    LATE_DELIVERY = 'late_delivery',
    WRONG_DELIVERY = 'wrong_delivery',
    OTHER = 'other',
}

export enum AccidentTypeIndonesian {
    LOST_ITEM = 'Barang Hilang',
    DAMAGED_ITEM = 'Barang Rusak',
    COLOR_BLED = 'Luntur',
    SHRUNK_ITEM = 'Pakaian Menyusut',
    LATE_DELIVERY = 'Terlambat Selesai',
    WRONG_DELIVERY = 'Salah Antar / Tertukar',
    OTHER = 'Lainnya',
}

export enum AccidentStatusEnglish {
    PENDING = 'pending',
    INVESTIGATING = 'investigating',
    RESOLVED = 'resolved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

export enum AccidentStatusIndonesian {
    PENDING = 'Menunggu Verifikasi',
    INVESTIGATING = 'Dalam Penyelidikan',
    RESOLVED = 'Selesai',
    REJECTED = 'Ditolak',
    CANCELLED = 'Dibatalkan',
}

export enum AccidentCompensationTypeEnglish {
    NONE = 'none',
    REFUND = 'refund',
    REPLACEMENT = 'replacement',
    FREE_SERVICE = 'free_service',
    REPAIR = 'repair',
}

export enum AccidentCompensationTypeIndonesian {
    NONE = 'Tidak Ada',
    REFUND = 'Pengembalian Uang',
    REPLACEMENT = 'Ganti Barang Baru',
    FREE_SERVICE = 'Layanan Gratis',
    REPAIR = 'Perbaikan Barang',
}

export enum AccidentDateTypeEnglish {
    ACCIDENT_CREATED = 'accident_created',
    ACCIDENT_UPDATED = 'accident_updated',
}

export enum AccidentDateTypeIndonesian {
    ACCIDENT_CREATED = 'Insiden Dilaporkan',
    ACCIDENT_UPDATED = 'Insiden Diubah',
}

export type AccidentTypeOption = {
    label: AccidentTypeIndonesian;
    value: AccidentTypeEnglish;
};

export type OrderComboboxItem = {
    id: number;
    order_code: string;
    customer_name: string;
    label: string;
    status: { label: OrderStatusIndonesian; value: OrderStatusEnglish };
};

export type OrderItemComboboxItem = {
    id: number;
    item_name: string;
    quantity: number;
    unit: string;
    label: string;
};

export interface AccidentStatusLog {
    id: number;
    accident_id: number;
    user: Pick<User, 'id' | 'name'> | null;
    field_name: 'status';
    from_status: { label: AccidentStatusIndonesian; value: AccidentStatusEnglish } | null;
    to_status: { label: AccidentStatusIndonesian; value: AccidentStatusEnglish };
    created_at: string;
}

export interface AccidentLogItem {
    id: number;
    name: string | null;
}

export interface AccidentFieldLog {
    id: number;
    accident_id: number;
    user: Pick<User, 'id' | 'name'> | null;
    field_name: string;
    old_value: string | null;
    new_value: string | null;
    item: AccidentLogItem | null;
    created_at: string;
}

export type AccidentLog = AccidentStatusLog | AccidentFieldLog;

export interface AccidentDetail extends Accident {
    outlet: Pick<Outlet, 'id' | 'name' | 'phone' | 'email' | 'address'>;
    reporter: Pick<User, 'id' | 'name'>;
    resolver: Pick<User, 'id' | 'name'> | null;
    order: Order | null;
    items: AccidentItem[];
    logs?: AccidentLog[];
}
