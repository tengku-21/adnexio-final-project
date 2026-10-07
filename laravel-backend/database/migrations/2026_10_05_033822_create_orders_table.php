<?php

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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

                $table->foreignId('package_id')
                    ->nullable()
                    ->nullOnDelete();

                $table->string('name');
                $table->string('phone');
                $table->string('email');
                $table->dateTime('date');
                $table->text('location');
                $table->string('detail')->nullable();
                $table->decimal('amount', 12, 2)->default(0.00);

                $table->string('status')->default('pending');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
