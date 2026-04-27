<?php

namespace App\Http\Requests\Service;

use App\Rules\Service\UniqueServiceNamePerOutletRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ServiceStoreRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', new UniqueServiceNamePerOutletRule($this->outlet_id)],
            'description' => ['required', 'string', 'max:255'],
            'outlet_id' => ['required', 'exists:outlets,id'],
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
            'outlet_id.required' => 'Outlet wajib diisi',
            'outlet_id.exists' => 'Outlet tidak valid',
        ];
    }
}
