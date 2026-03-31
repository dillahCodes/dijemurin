<?php

namespace App\Http\Requests\Service;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

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
            'name' => 'required|string|max:255|unique:service_items,name',
            'description' => 'required|string|max:255',
            'time' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'unit' => 'required|string|max:255',
            'service_id' => 'required|integer|exists:services,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama layanan wajib diisi',
            'name.unique' => 'Nama layanan sudah ada',
            'description.required' => 'Deskripsi wajib diisi',
            'time.required' => 'Waktu pengerjaan wajib diisi',
            'price.required' => 'Harga wajib diisi',
            'unit.required' => 'Satuan wajib diisi',
            'service_id.required' => 'Layanan wajib diisi',
            'price.numeric' => 'Harga harus berupa angka',
            'price.min' => 'Harga minimal Rp 1',
        ];
    }
}
