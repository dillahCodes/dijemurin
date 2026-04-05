<?php

namespace App\Http\Requests\Order;

use App\Enums\Order\OrderStatus;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class OrderUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                new Enum(OrderStatus::class),
                $this->validateStatusTransition(),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status wajib diisi.',
            'status.enum' => 'Status tidak valid.',
        ];
    }

    private function validateStatusTransition(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail) {
            $order = $this->route('order');

            if (! $order) {
                return;
            }

            $newStatus = OrderStatus::from($value);
            $currentStatus = $order->status;

            if (! $currentStatus->canTransitionTo($newStatus)) {
                $fail("Pesanan dengan status '{$currentStatus->indonesianLabel()}' tidak bisa diubah menjadi '{$newStatus->indonesianLabel()}'.");
            }
        };
    }
}
