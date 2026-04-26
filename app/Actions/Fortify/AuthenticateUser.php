<?php

namespace App\Actions\Fortify;

use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticateUser
{
    /**
     * Authenticate the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \App\Models\User|null
     */
    public function __invoke(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return null;
        }

        // validate user status
        if (! $user->status->canLogin()) {
            throw ValidationException::withMessages([
                'email' => match ($user->status) {
                    UserStatus::INACTIVE => 'Akun Anda tidak aktif. Silakan hubungi administrator',
                    UserStatus::SUSPENDED => 'Akun Anda telah ditangguhkan. Silakan hubungi administrator.',
                    default => 'Akun Anda tidak dapat digunakan untuk masuk.',
                },
            ]);
        }

        // validate user role
        if ($user->role === UserRole::GHOST) {
            throw ValidationException::withMessages([
                'email' => 'Akun Anda belum memiliki akses role. Silakan hubungi administrator.',
            ]);
        }

        // validate user outlet
        $hasSuperAdmin = $user->role === UserRole::SUPER_ADMIN;
        if (!$hasSuperAdmin && is_null($user->outlet_id)) {
            throw ValidationException::withMessages([
               'email' => 'Akun Anda belum ditugaskan ke outlet manapun. Silahkan hubungi administrator',
            ]);
        }

        return $user;
    }
}
