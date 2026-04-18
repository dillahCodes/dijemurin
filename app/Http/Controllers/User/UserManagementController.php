<?php

namespace App\Http\Controllers\User;

use App\DTOs\User\UserFilterDTO;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
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
        $currentRole = $request->user()->role;

        $users = UserService::getUsersData($filterUser, $currentRole);
        $filters = $filterUser->toArray();

        $userTransitionRules = UserRole::allowedTransitions();
        $userRoleOptions = UserRole::options($currentRole);
        $userStatusOptions = UserStatus::options();

        return Inertia::render('pengguna/pengguna', [
            'userTransitionRules' => $userTransitionRules,
            'userRoleOptions' => $userRoleOptions,
            'userStatusOptions' => $userStatusOptions,
            'users' => $users,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
