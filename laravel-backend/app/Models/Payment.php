<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Document as ModelsDocument;


class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'name',
        'phone',
        'amount',
        'currency',
        'status',
        'gateway',
        'method',
        'reference',
        'gateway_transaction_id',
        'gateway_status',
        'gateway_message',
        'gateway_response',
        'paid_at',
        'failed_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'gateway_response' => 'array',
            'paid_at' => 'datetime',
            'failed_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents()
    {
        return $this->hasMany(ModelsDocument::class);
    }
}