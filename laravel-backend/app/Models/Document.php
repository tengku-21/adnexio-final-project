<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'size'
    ];
}
