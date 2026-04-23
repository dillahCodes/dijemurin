import { User } from '@/types/feature/user/user';
import { ApiResponse } from '@/types/response';
import { PenggunaDetailHeader } from './pengguna-detail-header';
import { PenggunaDetailInfo } from './pengguna-detail-info';

export type PenggunaDetailSectionProps = {
    userStatusOptions: User['status'][];
    user: ApiResponse<User>;
};

export function PenggunaDetailSection() {
    return (
        <div className="flex flex-col gap-6">
            <PenggunaDetailHeader />
            <div className="w-full max-w-3xl bg-card">
                <PenggunaDetailInfo />
            </div>
        </div>
    );
}
