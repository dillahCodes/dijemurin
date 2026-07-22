<?php

namespace App\Listeners;

use Illuminate\Auth\Events\PasswordReset;

class MarkEmailAsVerifiedOnFirstPasswordReset
{
    /**
     * Handle the event.
     */
    public function handle(PasswordReset $event): void
    {
        if (is_null($event->user->email_verified_at)) {
            $event->user->forceFill([
                'email_verified_at' => now(),
            ])->save();
        }
    }
}
