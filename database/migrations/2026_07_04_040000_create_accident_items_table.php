<?php

use App\Enums\Accident\AccidentCompensationType;
use App\Enums\Accident\AccidentType;
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
        Schema::create('accident_items', function (Blueprint $table) {
            $table->id();

            // Relasi ke Header & Order Item
            $table->foreignId('accident_id')->constrained('accidents')->onDelete('cascade');
            $table->foreignId('order_item_id')->constrained('order_items')->onDelete('cascade');

            // Detail Kerusakan Barang
            $table->enum('type', AccidentType::toArray());
            $table->string('item_details')->nullable();
            $table->text('description');

            // Penyelesaian & Kompensasi Per Item
            $table->enum('compensation_type', AccidentCompensationType::toArray())->nullable();
            $table->unsignedBigInteger('compensation_amount')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accident_items');
    }
};
