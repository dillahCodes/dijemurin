<?php

namespace App\Services\Service;

use App\Enums\User\UserRole;
use App\Models\Service\Service;
use Illuminate\Support\Facades\DB;

class ServiceService
{
    /**
     * create a new service
     */
    public static function createService(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = auth()->user();

            // NOTE: if non super admin → force outlet id related to user
            if ($user && ! $user->hasRole(UserRole::SUPER_ADMIN)) {
                $data['outlet_id'] = $user->outlet_id;
            }

            return Service::create($data);
        });
    }

    /**
     * update an existing service
     */
    public static function updateService(Service $service, array $data)
    {
        return DB::transaction(function () use ($service, $data) {
            $user = auth()->user();

            // NOTE: if non super admin force outlet id related to user
            if ($user && ! $user->hasRole(UserRole::SUPER_ADMIN)) {
                $data['outlet_id'] = $user->outlet_id;
            }

            $service->update($data);

            return $service;
        });
    }

    /**
     * delete a service
     */
    public static function deleteService(Service $service)
    {
        return DB::transaction(function () use ($service) {
            return $service->delete();
        });
    }
}
