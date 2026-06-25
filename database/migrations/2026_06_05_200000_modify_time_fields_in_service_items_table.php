<?php

use App\Enums\Service\ServiceTimeType;
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
        Schema::table('service_items', function (Blueprint $table) {
            $table->dropColumn('time');
            $table->unsignedInteger('time_number')->after('description');
            $table->enum('time_type', ServiceTimeType::toArray())->after('time_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_items', function (Blueprint $table) {
            $table->dropColumn(['time_number', 'time_type']);
            $table->string('time')->after('description');
        });
    }
};
