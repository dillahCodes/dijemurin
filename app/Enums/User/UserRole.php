<?php

namespace App\Enums\User;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case CASHIER = 'cashier';
    case OPERATOR = 'operator';

    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }
}
