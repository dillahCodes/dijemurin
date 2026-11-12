<?php

namespace App\Http\Requests\Order;

use App\Enums\Order\OrderStatus;
use App\Rules\Order\RoleCanTransitionStatusRule;
use App\Rules\Order\ValidStatusTransition;
use App\Rules\Outlet\OutletIsActive;
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
        $orderRoute = $this->route('order');
        $userRole = $this->user()->role;
        $outletId = $orderRoute->outlet_id;

        return [
            'status' => [
                'required',
                new Enum(OrderStatus::class),
                new ValidStatusTransition($orderRoute),
                new RoleCanTransitionStatusRule($orderRoute, $userRole),
                new OutletIsActive($outletId),
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
}
