<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Department;

class Employed extends Model
{
    protected $table = 'employed';
    protected $primaryKey = 'employed_id';
    public $timestamps = false;

    protected $fillable = [
        'employed_id',
        'firstname_id',
        'last_name',
        'department_id',
        'total_acces',
        'is_active', 
    ];
    protected $casts = [
        'is_active' => 'boolean', 
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'id');
    }
    public function accessLogs()
    {
        return $this->hasMany(AccessLog::class, 'employed_id', 'employed_id');
    }
}
