<?php

namespace App\Http\Requests\Service;

use App\Enums\Service\ServiceTimeType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceItemsStoreRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'time_number' => ['required', 'integer', 'min:1'],
            'time_type' => ['required', 'string', Rule::enum(ServiceTimeType::class)],
            'price' => ['required', 'numeric', 'min:1'],
            'unit' => ['required', 'string', 'max:255'],
            'service_id' => ['required', 'integer', 'exists:services,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama layanan wajib diisi',
            'description.required' => 'Deskripsi wajib diisi',
            'time_number.required' => 'Waktu pengerjaan wajib diisi',
            'time_number.integer' => 'Waktu pengerjaan harus berupa angka',
            'time_number.min' => 'Waktu pengerjaan minimal 1',
            'time_type.required' => 'Tipe waktu wajib dipilih',
            'price.required' => 'Harga wajib diisi',
            'unit.required' => 'Satuan wajib diisi',
            'service_id.required' => 'Layanan wajib diisi',
            'price.numeric' => 'Harga harus berupa angka',
            'price.min' => 'Harga minimal Rp 1',
        ];
    }
}
