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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Your internal order
            $table->foreignId('order_id')
                ->constrained()
                ->cascadeOnDelete();

            // User who made the payment, optional
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Customer information at time of payment
            $table->string('name');
            $table->string('phone');

            // Money
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('MYR');
            
            // Internal payment state
            $table->string('status')->default('pending');
            
            // Payment gateway
            $table->string('gateway')->default('ipay88');
            $table->string('method')->nullable();

            // Gateway's transaction/reference identifiers
            $table->string('reference')->unique()->nullable();
            $table->string('gateway_transaction_id')->nullable();

            // Gateway response information
            $table->string('gateway_status')->nullable();
            $table->string('gateway_message')->nullable();
            $table->json('gateway_response')->nullable();

            // Timestamps from the payment lifecycle
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('failed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
