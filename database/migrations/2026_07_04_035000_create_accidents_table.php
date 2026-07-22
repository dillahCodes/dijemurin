<?php

use App\Enums\Accident\AccidentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accidents', function (Blueprint $table) {
            $table->id();

            // Relasi Asosiasi (Header)
            $table->foreignId('outlet_id')->constrained('outlets')->onDelete('cascade');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('resolver_id')->nullable()->constrained('users')->onDelete('set null');

            // Detail Insiden (Header)
            $table->text('description')->nullable();
            $table->enum('status', AccidentStatus::toArray())->default(AccidentStatus::PENDING->value);

            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accidents');
    }
};
