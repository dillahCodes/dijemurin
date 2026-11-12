<?php

namespace App\Http\Requests\Accident;

use App\Enums\Accident\AccidentType;
use App\Rules\Accident\AllowedOrderStatusForAccidentRule;
use App\Rules\Accident\OrderBelongsToOutletRule;
use App\Rules\Accident\UniqueActiveAccidentItemRule;
use App\Rules\Accident\VerifyOutletAccessRule;
use App\Rules\Outlet\OutletIsActive;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class AccidentStoreRequest extends FormRequest
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
            // Header fields
            'outlet_id' => ['required', 'exists:outlets,id', new VerifyOutletAccessRule($this->user()), new OutletIsActive],
            'order_id' => ['required', 'exists:orders,id', new OrderBelongsToOutletRule($this->user()), new AllowedOrderStatusForAccidentRule],
            'description' => ['nullable', 'string'],

            // Items array (wajib minimal 1 item)
            'items' => ['required', 'array', 'min:1'],
            'items.*.order_item_id' => ['required', 'integer', 'exists:order_items,id', new UniqueActiveAccidentItemRule],
            'items.*.type' => ['required', new Enum(AccidentType::class)],
            'items.*.item_details' => ['nullable', 'string', 'max:255'],
            'items.*.description' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'outlet_id.exists' => 'Outlet tidak valid.',
            'order_id.required' => 'Pesanan wajib diisi.',
            'order_id.exists' => 'Pesanan tidak valid.',
            'description.string' => 'Catatan laporan harus berupa teks.',
            'items.required' => 'Minimal satu item kerusakan wajib dilaporkan.',
            'items.min' => 'Minimal satu item kerusakan wajib dilaporkan.',
            'items.*.order_item_id.required' => 'Item pesanan wajib dipilih.',
            'items.*.order_item_id.exists' => 'Item pesanan tidak valid.',
            'items.*.type.required' => 'Jenis insiden wajib diisi.',
            'items.*.item_details.max' => 'Detail item maksimal 255 karakter.',
            'items.*.description.required' => 'Kronologi kerusakan wajib diisi.',
        ];
    }
}
