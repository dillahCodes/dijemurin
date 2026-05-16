<?php

namespace App\Http\Requests\Outlet;

use App\Enums\Outlet\OutletStatus;
use App\Enums\User\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class OutletEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole([UserRole::SUPER_ADMIN]) ?? false;
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
            'address' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'status' => ['required', new Enum(OutletStatus::class)],
            'picture' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama outlet wajib diisi.',
            'name.max' => 'Nama outlet maksimal 255 karakter.',
            'address.required' => 'Alamat wajib diisi.',
            'address.max' => 'Alamat maksimal 255 karakter.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'phone.max' => 'Nomor telepon maksimal 255 karakter.',
            'status.required' => 'Status wajib diisi.',
            'status.enum' => 'Status tidak valid.',
            'picture.image' => 'Gambar harus berupa file gambar.',
            'picture.mimes' => 'Gambar harus berupa file dengan format JPG, JPEG, atau PNG.',
            'picture.max' => 'Gambar maksimal 2MB.',
        ];
    }
}
