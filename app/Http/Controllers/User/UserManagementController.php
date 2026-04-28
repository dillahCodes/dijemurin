<?php

namespace App\Http\Controllers\User;

use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\DTOs\User\UserFilterDTO;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserEditRequest;
use App\Http\Requests\User\UserStoreRequest;
use App\Models\User;
use App\Services\Outlet\OutletService;
use App\Services\User\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterUser = UserFilterDTO::fromRequest($request);
        $filterCombobox = OutletComboboxFilterDTO::fromRequest($request);
        $currentRole = $request->user()->role;

        $users = UserService::getUsersDataIndex($filterUser, $filterCombobox);

        $filters = $filterUser->toArray();
        $comboboxFilters = $filterCombobox->toArray();
        $mergedFilters = array_merge($filters, $comboboxFilters);

        $userTransitionRules = UserRole::allowedTransitions();
        $userRoleOptions = UserRole::options($currentRole);
        $userStatusOptions = UserStatus::options();

        $outlets = OutletService::getOutletsComboboxData($filterCombobox);
        $outletSelected = OutletService::getOutletSelected($filterCombobox);

        return Inertia::render('pengguna/pengguna', [
            'userTransitionRules' => $userTransitionRules,
            'userRoleOptions' => $userRoleOptions,
            'userStatusOptions' => $userStatusOptions,
            'users' => $users,
            'filters' => $mergedFilters,
            'outlets' => $outlets,
            'outletSelected' => $outletSelected,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('pengguna/pengguna-tambah');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        $data = $request->validated();
        UserService::createUser($data);

        return redirect()->route('pengguna.index')->with('success', 'Pengguna berhasil ditambahkan dan email set password telah dikirim');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $userData = UserService::getUserById($user->id);

        return Inertia::render('pengguna/pengguna-detail', [
            'user' => $userData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $userStatusOptions = UserStatus::options();
        $userData = UserService::getUserById($user->id);

        return Inertia::render('pengguna/pengguna-edit', [
            'user' => $userData,
            'userStatusOptions' => $userStatusOptions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserEditRequest $request, User $user)
    {
        $data = $request->validated();
        UserService::updateUser($user, $data);

        return redirect()->route('pengguna.index')->with([['success' => 'Pengguna berhasil diupdate']]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
