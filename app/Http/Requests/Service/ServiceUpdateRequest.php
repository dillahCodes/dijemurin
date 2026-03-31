<?php

namespace App\Http\Requests\Service;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceUpdateRequest extends FormRequest
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
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('services', 'name')->ignore($this->service), //  Route::patch('/{service}'.. visit web.php
            ],
            'description' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],
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
        ];
    }
}
