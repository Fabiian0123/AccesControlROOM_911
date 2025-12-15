<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Employed;

class AccessLog extends Model
{
    protected $table = 'access_logs';
    public $timestamps = false;
    protected $fillable = [
        'employed_id',
        'attempted_at',
        'was_successful',
        'status',
    ];
    protected $casts = [
        'attempted_at'   => 'datetime',
        'was_successful' => 'boolean',
    ];
    public function employee()
    {
        return $this->belongsTo(Employed::class, 'employed_id', 'employed_id');
    }
}
