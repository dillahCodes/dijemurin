<?php

namespace App\Services\Outlet;

use App\Enums\Outlet\OutletStatus;
use App\Models\Outlet\Outlet;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class OutletService
{
    /**
     * create outlet
     */
    public static function createOutlet(array $data)
    {
        return DB::transaction(function () use ($data) {
            $outlet = Outlet::create([
                'name' => $data['name'] ?? null,
                'address' => $data['address'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
            ]);

            if (isset($data['picture']) && $data['picture'] instanceof UploadedFile) {
                $path = self::storeOutletPicture($data['picture'], $outlet->id);
                $outlet->update(['picture' => $path]);
            }

            return $outlet;
        });
    }

    /**
     * Store outlet picture using outlet ID as the file name.
     */
    public static function storeOutletPicture(UploadedFile $picture, int $outletId)
    {
        $filename = "{$outletId}.{$picture->extension()}";

        return $picture->storeAs('outlets', $filename, 'public');
    }

    /**
     * update outlet
     */
    public static function updateOutlet(Outlet $outlet, array $data)
    {
        return DB::transaction(function () use ($outlet, $data) {
            $outlet->update([
                'name' => $data['name'] ?? null,
                'address' => $data['address'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'status' => $data['status'] ?? OutletStatus::ACTIVE,
            ]);

            if (isset($data['picture']) && $data['picture'] instanceof UploadedFile) {
                $path = self::storeOutletPicture($data['picture'], $outlet->id);
                $outlet->update(['picture' => $path]);
            }

            return $outlet;
        });
    }
}
