<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BillingProduct extends Model
{
    protected $table = 'billing_product';

    protected $with = [
//        'article',
    ];

    protected $appends = [
        'expiration'
    ];

    public function getExpirationAttribute()
    {
        if ($this->expiration_date === null) {
            return BillingProduct::where('id', $this->parent_id)->first()->expiration_date;
        }

        return $this->expiration_date;
    }

    /**
     * Get the article that belongs to the product
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function article()
    {
        return $this->hasOne(TwinfieldArticle::class, 'id', 'article_id');
    }

    /**
     * Get the parent of the product
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(BillingProduct::class, 'parent_id', 'id');
    }
}
