<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;

class SetPasswordNotification extends ResetPassword
{
    /**
     * Override URL to point to /set-password route instead of /reset-password
     */
    protected function resetUrl($notifiable): string
    {
        return url(route('set-password', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));
    }

    /**
     * Build the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $url = $this->resetUrl($notifiable);
        $expire = config('auth.passwords.'.config('auth.defaults.passwords').'.expire', 60);

        return (new MailMessage)
            ->subject(Lang::get('Set your password'))
            ->greeting(Lang::get('Hello!'))
            ->line(Lang::get('Your account has been created by an administrator. Click the button below to set your password.'))
            ->action(Lang::get('Set Password'), $url)
            ->line(Lang::get('This set password link will expire in :count minutes.', ['count' => $expire]))
            ->line(Lang::get('If you did not expect to receive this invitation, no further action is required.'));
    }
}
