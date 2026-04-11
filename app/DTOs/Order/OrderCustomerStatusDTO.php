<?php

namespace App\DTOs\Order;

use Illuminate\Http\Request;

class OrderCustomerStatusDTO
{
    public function __construct(
        public readonly ?string $orderCode,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('order_code'),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'order_code' => $this->orderCode,
        ], fn ($value) => $value !== null);
    }
}
