<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SetPasswordController extends Controller
{
    public function show(Request $request, string $token)
    {
        return Inertia::render('auth/set-password', [
            'token' => $token,
            'email' => $request->query('email', ''),
        ]);
    }
}
