<?php

namespace App\Http\Requests\Service;

use App\Rules\Service\UniqueServiceNamePerOutletRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

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
            'name' => ['required', 'string', 'max:255', new UniqueServiceNamePerOutletRule($this->service->outlet_id, $this->service->id)],
            'description' => ['required', 'string', 'max:255'],
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
