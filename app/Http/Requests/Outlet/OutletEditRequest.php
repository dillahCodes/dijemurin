<?php

namespace App\Http\Requests\Outlet;

use App\Enums\Outlet\OutletStatus;
use App\Rules\Outlet\OutletNoRoleConflictRule;
use App\Rules\Outlet\OutletUserIsUnassigned;
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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $outletId = $this->route('outlet')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'status' => ['required', new Enum(OutletStatus::class)],
            'admin' => ['required', 'integer', 'exists:users,id', new OutletNoRoleConflictRule, new OutletUserIsUnassigned($outletId)],
            'cashiers' => ['nullable', 'array', new OutletNoRoleConflictRule],
            'cashiers.*' => ['required', 'integer', 'distinct', 'exists:users,id', new OutletUserIsUnassigned($outletId)],
            'operators' => ['nullable', 'array', new OutletNoRoleConflictRule],
            'operators.*' => ['required', 'integer', 'distinct', 'exists:users,id', new OutletUserIsUnassigned($outletId)],
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
            'admin.required' => 'Admin wajib dipilih.',
            'admin.integer' => 'Admin harus berupa integer.',
            'admin.exists' => 'Admin tidak valid.',
            'cashiers.array' => 'Kasir harus berupa array.',
            'cashiers.*.required' => 'Kasir wajib diisi.',
            'cashiers.*.integer' => 'Kasir harus berupa integer.',
            'cashiers.*.exists' => 'Kasir tidak valid.',
            'operators.array' => 'Operator harus berupa array.',
            'operators.*.required' => 'Operator wajib diisi.',
            'operators.*.integer' => 'Operator harus berupa integer.',
            'operators.*.exists' => 'Operator tidak valid.',
        ];
    }
}
