<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnauthorizedAccessLog extends Model
{
    protected $table = 'unauthorized_access_logs';
    public $timestamps = false;
    protected $fillable = [
        'attempted_id',
        'attempted_at',
    ];
    protected $casts = [
        'attempted_at' => 'datetime',
    ];
}
