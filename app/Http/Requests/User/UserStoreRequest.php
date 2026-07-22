<?php

namespace App\Http\Requests\User;

use App\Enums\User\UserRole;
use App\Rules\User\AllowedRoleTransitionRule;
use App\Rules\User\OnlySuperAdminRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UserStoreRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'role' => ['nullable', 'string', new Enum(UserRole::class), new AllowedRoleTransitionRule],
            'outlet_id' => ['nullable', 'integer', 'exists:outlets,id', new OnlySuperAdminRule],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diisi.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'email.unique' => 'Email sudah terdaftar.',
            'role.not_in' => 'Role tidak valid.',
            'outlet_id.exists' => 'Outlet tidak ditemukan.',
        ];
    }
}
