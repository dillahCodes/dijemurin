import type { User } from '@/types/feature/user/user';
import type { ApiResponse } from '@/types/response';
import { PenggunaEditForm } from './pengguna-edit-form';
import { PenggunaEditHeader } from './pengguna-edit-header';

export type PenggunaEditSectionProps = {
    userStatusOptions: User['status'][];
    user: ApiResponse<User>;
};

export function PenggunaEditSection() {
    return (
        <div className="flex flex-col gap-6">
            <PenggunaEditHeader />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <PenggunaEditForm />
            </div>
        </div>
    );
}
