<?php

namespace App\Http\Requests\Service;

use App\Enums\User\UserRole;
use App\Rules\Outlet\OutletIsActive;
use App\Rules\Service\OnlySuperAdminRule;
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
        return $this->user()?->hasAnyRole([UserRole::SUPER_ADMIN, UserRole::ADMIN]) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $outletId = $this->outlet_id ?? $this->user()?->outlet_id;

        return [
            'name' => ['required', 'string', 'max:255', new UniqueServiceNamePerOutletRule($outletId)],
            'description' => ['required', 'string', 'max:255'],
            'outlet_id' => ['nullable', 'integer', 'exists:outlets,id', new OnlySuperAdminRule, new OutletIsActive],
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
            'outlet_id.exists' => 'Outlet tidak valid',
        ];
    }
}
