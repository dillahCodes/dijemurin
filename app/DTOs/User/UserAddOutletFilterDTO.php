<?php

namespace App\DTOs\User;

use Illuminate\Http\Request;

class UserAddOutletFilterDTO
{
    private const DEFAULT_LIMIT = 5;

    private const MAX_LIMIT = 100;

    public function __construct(
        public readonly ?string $search,
        public readonly int $limit,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('search'),
            self::DEFAULT_LIMIT
        );
    }

    public static function fromRequestWithLimit(Request $request): self
    {
        $limit = (int) $request->query('limit', self::DEFAULT_LIMIT);

        return new self(
            $request->query('search'),
            self::sanitizeLimit($limit)
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'search' => $this->search,
        ], fn ($value) => $value !== null);
    }

    private static function sanitizeLimit(int $limit): int
    {
        if ($limit < 1) {
            return self::DEFAULT_LIMIT;
        }

        return min($limit, self::MAX_LIMIT);
    }
}
