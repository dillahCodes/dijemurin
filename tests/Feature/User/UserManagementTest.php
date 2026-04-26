<?php

namespace Tests\Feature\User;

use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\User;
use App\Notifications\SetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_new_user_and_send_set_password_link(): void
    {
        Notification::fake();

        $admin = User::factory()->create([
            'role' => UserRole::SUPER_ADMIN,
        ]);

        $response = $this->actingAs($admin)->post(route('pengguna.store'), [
            'name' => 'New User Foo',
            'email' => 'newuser@example.com',
            'role' => UserRole::OPERATOR->value,
            'status' => UserStatus::ACTIVE->value,
        ]);

        $response->assertRedirect(route('pengguna.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'name' => 'New User Foo',
        ]);

        $createdUser = User::where('email', 'newuser@example.com')->first();
        $this->assertNotNull($createdUser->password); // Assert password was generated

        Notification::assertSentTo($createdUser, SetPasswordNotification::class);
    }
}
