<?php

use App\Enums\User\UserRole;
use App\Models\User;

test('super admin can access printer settings', function () {
    $user = User::factory()->create(['role' => UserRole::SUPER_ADMIN->value]);

    $this->actingAs($user)
        ->get(route('printer.edit'))
        ->assertOk();
});

test('admin can access printer settings', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN->value]);

    $this->actingAs($user)
        ->get(route('printer.edit'))
        ->assertOk();
});

test('cashier can access printer settings', function () {
    $user = User::factory()->create(['role' => UserRole::CASHIER->value]);

    $this->actingAs($user)
        ->get(route('printer.edit'))
        ->assertOk();
});

test('operator cannot access printer settings', function () {
    $user = User::factory()->create(['role' => UserRole::OPERATOR->value]);

    $this->actingAs($user)
        ->get(route('printer.edit'))
        ->assertForbidden();
});

test('guest is redirected to login from printer settings', function () {
    $this->get(route('printer.edit'))
        ->assertRedirect(route('login'));
});
