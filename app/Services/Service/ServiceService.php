<?php

namespace App\Services\Service;

use App\DTOs\Service\ServiceFilterDTO;
use App\DTOs\Service\ServiceItemFilterDTO;
use App\Models\Service\Service;

class ServiceService
{
    /**
     * get service with search filter
     */
    public static function getServicesData(ServiceFilterDTO $filter)
    {
        return Service::search($filter->search)->latest()->get();
    }

    /**
     * get service item with search filter
     */
    public static function getServiceItems(Service $service, ServiceItemFilterDTO $filter)
    {
        return $service->items()->search($filter->search)->latest()->get();
    }
}
