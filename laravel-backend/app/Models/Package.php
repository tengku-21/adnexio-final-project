<?php

namespace App\Models;

use App\Models\Document as ModelsDocument;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'name',
        'detail',
        'amount',
        'currency',
        'popular'
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'popular' => 'boolean',
        ];
    }

    
    public function documents()
    {
        return $this->hasMany(ModelsDocument::class);
    }
}