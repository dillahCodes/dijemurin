<?php

namespace App\Http\Requests\service;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceItemUpdateRequest extends FormRequest
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
            //  Route::delete('/{service}/items/{serviceItem}'... visit web.php
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('service_items', 'name')->ignore($this->serviceItem)],
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'time' => ['sometimes', 'required', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:1'],
            'unit' => ['sometimes', 'required', 'string', 'max:255'],
            'service_id' => ['sometimes', 'required', 'integer', Rule::exists('services', 'id')],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama layanan wajib diisi',
            'name.unique' => 'Nama layanan sudah ada',
            'name.max' => 'Nama layanan maksimal 255 karakter',
            'description.required' => 'Deskripsi layanan wajib diisi',
            'description.max' => 'Deskripsi layanan maksimal 255 karakter',
            'time.required' => 'Waktu pengerjaan wajib diisi',
            'time.max' => 'Waktu pengerjaan maksimal 255 karakter',
            'price.required' => 'Harga wajib diisi',
            'price.min' => 'Harga minimal 1',
            'price.numeric' => 'Harga harus berupa angka',
            'unit.required' => 'Satuan wajib diisi',
            'unit.max' => 'Satuan maksimal 255 karakter',
            'service_id.required' => 'Layanan wajib diisi',
            'service_id.exists' => 'Layanan tidak ditemukan',
        ];
    }
}
