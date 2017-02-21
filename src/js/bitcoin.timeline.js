var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

var Transaction = Backbone.Model.extend({
    isBuy: function() {
        return this.get('subType') == 'Buy';
    },

    isSell: function() {
        return this.get('subType') == 'Sell';
    },

    isWithdrawal: function() {
        return this.get('type') == 'Withdrawal';
    },
    
    isDeposit: function() {
        return this.get('type') == 'Deposit';
    }
});

var Transactions = Backbone.Collection.extend({
    model: Transaction,

    initialize: function(options)
    {
        this.getPrice();
    },

    getPrice: function(code)
    {
        if (code == undefined)
        {
            code = 'USD';
        }
        var ratesUrl = 'https://bitpay.com/api/rates';
    
        // get current USD price
        var here = this;
        getJSON(ratesUrl).then(function(result)
        {
            here.currentPrice = _.first(_.where(result, {code: code}));
        });
    },

    withdrawalOnly: function()
    {
        return _.reject(this.models, function(obj)
        {
            return !obj.isWithdrawal();
        });
    },

    buyOnly: function()
    {
        return _.reject(this.models, function(obj)
        {
            return !obj.isBuy();
        });
    },
 
    records_by_day: function(filter)
    {
        return _.groupBy(this[filter](), function(item)
        {
            return item.get('datestring');
        });
    },

    total_by: function(by, filter)
    {
        if (filter == 'buy')
        {
            filter = 'buyOnly';
        }
        else if (filter == 'withdrawal')
        {
            filter = 'withdrawalOnly';
        }
        return _.reduce(this.records_by_day(filter), function(total, obj)
        {
            return total + _.reduce(obj, function(memo, num)
            {
                return memo + num.get(by);
            }, 0);
        }, 0);
    },

    total_spent: function()
    {
        return this.total_by('value', 'buy');
    },

    total_bought: function()
    {
        return this.total_by('amount', 'buy');
    },

    total_fees: function()
    {
        return this.total_by('fee', 'buy');
    },

    get_rate: function(item)
    {
        return item.get('rate');
    },

    highest_rate: function()
    {
        return _.max(this.buyOnly(), this.get_rate).get('rate');
    },

    lowest_rate: function()
    {
        return _.min(this.buyOnly(), this.get_rate).get('rate');
    },

    // withdrawal
    total_withdrawal: function()
    {
        return this.total_by('amount', 'withdrawal');
    }
});