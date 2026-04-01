<?php

namespace App\Helpers;

class StringHelper
{
    public static function getInitials(string $name): string
    {
        return collect(explode(' ', $name))
            ->map(fn ($word) => strtoupper($word[0]))
            ->implode('');
    }
}
