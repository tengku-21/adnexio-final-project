<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    protected $fillable = [
        'order_id',
        'package_id',
        'payment_id',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size',
    ];

    protected $appends = [
        'url',
    ];

    public function getUrlAttribute(): string
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk($this->disk ?? 'public');

        return $disk->url($this->path);
    }
}