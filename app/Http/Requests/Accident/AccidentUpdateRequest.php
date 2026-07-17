<?php

namespace App\Http\Requests\Accident;

use App\Enums\Accident\AccidentCompensationType;
use App\Enums\Accident\AccidentStatus;
use App\Enums\Accident\AccidentType;
use App\Rules\Accident\RoleCanUpdateAccidentFieldsRule;
use App\Rules\Accident\RoleCanUpdateAccidentItemFieldsRule;
use App\Rules\Accident\ValidAccidentCompensationAmountRule;
use App\Rules\Accident\ValidAccidentStatusTransition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class AccidentUpdateRequest extends FormRequest
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
     */
    public function rules(): array
    {
        $accident = $this->route('accident');
        $user = $this->user();

        return [
            'description' => [
                'sometimes',
                'nullable',
                'string',
                new RoleCanUpdateAccidentFieldsRule($accident, $user, 'description'),
            ],
            'status' => [
                'sometimes',
                new Enum(AccidentStatus::class),
                new ValidAccidentStatusTransition($accident),
                new RoleCanUpdateAccidentFieldsRule($accident, $user, 'status'),
            ],
            'resolver_id' => [
                'nullable',
                'exists:users,id',
                new RoleCanUpdateAccidentFieldsRule($accident, $user, 'resolver_id'),
            ],
            'items' => [
                'sometimes',
                'array',
                'min:1',
            ],
            'items.*.id' => [
                'required',
                'integer',
                'exists:accident_items,id',
            ],
            'items.*.type' => [
                'required',
                new Enum(AccidentType::class),
                new RoleCanUpdateAccidentFieldsRule($accident, $user, 'type'),
            ],
            'items.*.item_details' => [
                'nullable',
                'string',
                'max:255',
                new RoleCanUpdateAccidentFieldsRule($accident, $user, 'item_details'),
            ],
            'items.*.description' => [
                'required',
                'string',
                new RoleCanUpdateAccidentFieldsRule($accident, $user, 'description'),
            ],
            'items.*.compensation_type' => [
                'nullable',
                new Enum(AccidentCompensationType::class),
                new RoleCanUpdateAccidentItemFieldsRule($user),
            ],
            'items.*.compensation_amount' => [
                'nullable',
                'integer',
                'required_if:items.*.compensation_type,refund,replacement,free_service,repair',
                new RoleCanUpdateAccidentItemFieldsRule($user),
                new ValidAccidentCompensationAmountRule,
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'items.*.compensation_amount.required_if' => 'Estimasi kerugian wajib diisi jika jenis kompensasi dipilih.',
            'items.*.compensation_amount.min' => 'Estimasi kerugian harus minimal Rp 1.',
            'items.*.compensation_amount.prohibited_if' => 'Estimasi kerugian tidak boleh diisi jika jenis kompensasi adalah "Tidak Ada".',
        ];
    }
}
