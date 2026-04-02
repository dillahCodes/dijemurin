<?php

namespace App\Http\Requests\Order;

use App\Enums\Order\OrderStatus;
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
            'status' => ['required', new Enum(OrderStatus::class)],
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
