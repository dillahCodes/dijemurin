<?php

namespace App\Http\Requests\Order;

use App\Enums\Payment\PaymentMethod;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class OrderStoreRequest extends FormRequest
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
            'customer_name' => ['required', 'string', 'max:255'],
            'payment_method' => ['required', new Enum(PaymentMethod::class)],
            'payment_amount' => ['required', 'numeric', 'min:0'],
            'cart_items' => ['required', 'array', 'min:1'],
            'cart_items.*.id' => ['required', 'integer', 'exists:service_items,id'],
            'cart_items.*.qty' => ['required', 'numeric', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Nama pelanggan wajib diisi.',
            'customer_name.max' => 'Nama pelanggan maksimal 255 karakter.',
            'payment_method.required' => 'Metode pembayaran wajib diisi.',
            'payment_method.enum' => 'Metode pembayaran harus cash atau qris.',
            'payment_amount.required' => 'Jumlah pembayaran wajib diisi.',
            'payment_amount.numeric' => 'Jumlah pembayaran harus berupa angka.',
            'payment_amount.min' => 'Jumlah pembayaran minimal 0.',
            'cart_items.required' => 'Keranjang tidak boleh kosong.',
            'cart_items.array' => 'Keranjang harus berupa array.',
            'cart_items.min' => 'Keranjang minimal berisi 1 item.',
            'cart_items.*.id.required' => 'ID item wajib diisi.',
            'cart_items.*.id.integer' => 'ID item harus berupa integer.',
            'cart_items.*.id.exists' => 'ID item tidak valid.',
            'cart_items.*.qty.required' => 'Jumlah item wajib diisi.',
            'cart_items.*.qty.numeric' => 'Jumlah item harus berupa angka.',
            'cart_items.*.qty.min' => 'Jumlah item minimal 1.',
        ];
    }
}
